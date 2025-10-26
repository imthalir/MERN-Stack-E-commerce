require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 5000;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.DEV_BASE_URL;

app.use(express.json());
app.use(cors());
app.use('/images', express.static('upload/images'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Models
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String
  }],
  totalAmount: Number,
  paymentMethod: { type: String, enum: ["COD", "Stripe"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
  orderDate: { type: Date, default: Date.now }
});

// Middleware
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ errors: "Please authenticate using a valid token" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).send({ errors: "Invalid token" });
  }
};

// Routes
app.get("/", (req, res) => res.send("Express App is Running"));

app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `${BASE_URL}/images/${req.file.filename}`
  });
});

app.post('/addproduct', async (req, res) => {
  const products = await Product.find({});
  const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const product = new Product({ id, ...req.body });
  await product.save();
  res.json({ success: true, name: req.body.name });
});

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.post('/signup', async (req, res) => {
  const existingUser = await Users.findOne({ email: req.body.email });
  if (existingUser) return res.status(400).json({ success: false, errors: "Email already in use" });

  const cart = Object.fromEntries(Array.from({ length: 300 }, (_, i) => [i, 0]));
  const user = new Users({ ...req.body, cartData: cart });
  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  res.json({ success: true, token });
});

app.post('/login', async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user || req.body.password !== user.password) {
    return res.json({ success: false, errors: "Invalid credentials" });
  }

  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  res.json({ success: true, token });
});

app.get('/newcollections', async (req, res) => {
  const products = await Product.find({});
  res.send(products.slice(-8));
});

app.get('/popular', async (req, res) => {
  const products = await Product.find({});
  res.send(products.slice(0, 4));
});

app.get('/related', async (req, res) => {
  const products = await Product.find({});
  res.send(products.slice(0, 4));
});

app.post('/addtocart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  user.cartData[req.body.itemId] += 1;
  await user.save();
  res.json({ success: true, message: "Item added to cart" });
});

app.post('/removefromcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  if (user.cartData[req.body.itemId] > 0) user.cartData[req.body.itemId] -= 1;
  await user.save();
  res.json({ success: true, message: "Item removed from cart" });
});

app.post('/getcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

app.post('/create-payment-intent', fetchUser, async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      automatic_payment_methods: { enabled: true }
    });
    res.send({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/createorder', fetchUser, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, paymentIntentId } = req.body;
    if (!items?.length || totalAmount <= 0) return res.status(400).json({ success: false, error: "Invalid order data" });

    let paymentStatus = "pending";
    if (paymentMethod === "Stripe") {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== "succeeded") return res.status(400).json({ success: false, error: "Payment not confirmed" });
      paymentStatus = "paid";
    }

    const itemsWithImage = await Promise.all(items.map(async item => {
      const product = await Product.findById(item.productId);
      return { ...item, image: product.image };
    }));

    const order = new Order({
      userId: req.user.id,
      items: itemsWithImage,
      totalAmount,
      paymentMethod,
      paymentStatus
    });

    await order.save();

    const emptyCart = Object.fromEntries(Array.from({ length: 300 }, (_, i) => [i, 0]));
    await Users.findByIdAndUpdate(req.user.id, { cartData: emptyCart });

    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to place order" });
  }
});

app.get('/myorders', fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.productId");
    res.json({ success: true, orders });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
    }
});

app.get('/allorders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch all orders" });
  }
});

app.post('/updateorderstatus', fetchUser, async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log("Error: " + error);
  } else {
    console.log("Server is running on port " + port);
  }
});
