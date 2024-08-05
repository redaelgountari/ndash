import mongoose, { Schema } from 'mongoose';

// Address Schema
const addressSchema = new Schema({
  addressID: { type: Schema.Types.ObjectId, auto: true },
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, { timestamps: true });

addressSchema.index({ userID: 1 });

// Review Schema
const reviewSchema = new Schema({
  reviewID: { type: Schema.Types.ObjectId, auto: true },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  clientID: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

// Category Schema
const categorySchema = new Schema({
  categoryID: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

categorySchema.index({ name: 1 });

// OrderItem Schema
const orderItemSchema = new Schema({
  orderItemID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Order Schema
const orderSchema = new Schema({
  orderID: { type: Schema.Types.ObjectId, auto: true },
  clientID: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  totalAmount: { type: Number },
}, { timestamps: true });

orderSchema.index({ clientID: 1, status: 1 });

// Shipment Schema
const shipmentSchema = new Schema({
  shipmentID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  addressID: { type: Schema.Types.ObjectId, ref: 'Address' },
  shipmentDate: { type: Date },
  deliveryDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
}, { timestamps: true });

// Courier Schema
const courierSchema = new Schema({
  courierID: { type: Schema.Types.ObjectId, auto: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  vehicle: { type: String },
}, { timestamps: true });

courierSchema.index({ email: 1 });

// Inventory Schema
const inventorySchema = new Schema({
  inventoryID: { type: Schema.Types.ObjectId, auto: true },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
});

// Payment Schema
const paymentSchema = new Schema({
  paymentID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
  },
  amount: { type: Number, required: true },
}, { timestamps: true });

// Product Schema
const productSchema = new Schema({
  productID: { type: Schema.Types.ObjectId, auto: true },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoryID: { type: Schema.Types.ObjectId, ref: 'Category' },
  available: { type: Boolean, default: true },
  image: { type: String },
}, { timestamps: true });

productSchema.index({ name: 1 });

// User Schema
const userSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  userType: {
    type: String,
    enum: ['client', 'seller', 'admin', 'courier'],
    required: true,
  },
  avatarImage: { type: String },
}, { timestamps: true });

userSchema.index({ email: 1 });

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
const Courier = mongoose.models.Courier || mongoose.model('Courier', courierSchema);
const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

export {
  Address,
  Review,
  Category,
  OrderItem,
  Order,
  Shipment,
  Courier,
  Inventory,
  Payment,
  Product,
  User,
};
