
// node --experimental-modules ./src/lib/backend/seeder/seeder.cjs
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { Schema } = mongoose;

// MongoDB connection setup
let isConnected = false;
console.log('MongoDB URI:', process.env.MONGODB_URI);

const connectMongoDb = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

// Schemas
const adresseSchema = new Schema({
  AdresseID: { type: Schema.Types.ObjectId, auto: true },
  UtilisateurID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  LigneAdresse1: { type: String, required: true },
  LigneAdresse2: { type: String },
  Ville: { type: String, required: true },
  Etat: { type: String, required: true },
  CodePostal: { type: String, required: true },
  Pays: { type: String, required: true },
}, { timestamps: true });

adresseSchema.index({ UtilisateurID: 1 });

const avisSchema = new Schema({
  AvisID: { type: Schema.Types.ObjectId, auto: true },
  ProduitID: { type: Schema.Types.ObjectId, ref: 'Produit' },
  ClientID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Note: { type: Number, min: 1, max: 5 },
  Commentaire: { type: String },
}, { timestamps: true });

const categorieSchema = new Schema({
  CategorieID: { type: Schema.Types.ObjectId, auto: true },
  Nom: { type: String, required: true },
  Description: { type: String },
}, { timestamps: true });

categorieSchema.index({ Nom: 1 });

const commandeArticleSchema = new Schema({
  CommandeArticleID: { type: Schema.Types.ObjectId, auto: true },
  CommandeID: { type: Schema.Types.ObjectId, ref: 'Commande' },
  ProduitID: { type: Schema.Types.ObjectId, ref: 'Produit' },
  Quantite: { type: Number, required: true },
  Prix: { type: Number, required: true },
});

const commandeSchema = new Schema({
  CommandeID: { type: Schema.Types.ObjectId, auto: true },
  ClientID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Statut: {
    type: String,
    enum: ['En attente', 'Traitee', 'Expediee', 'Livree', 'Annulee'],
    default: 'En attente',
  },
  MontantTotal: { type: Number },
}, { timestamps: true });

commandeSchema.index({ ClientID: 1, Statut: 1 });

const expeditionSchema = new Schema({
  ExpeditionID: { type: Schema.Types.ObjectId, auto: true },
  CommandeID: { type: Schema.Types.ObjectId, ref: 'Commande' },
  AdresseID: { type: Schema.Types.ObjectId, ref: 'Adresse' },
  DateExpedition: { type: Date },
  DateLivraison: { type: Date },
  Statut: {
    type: String,
    enum: ['En attente', 'Expediee', 'Livree'],
    default: 'En attente',
  },
}, { timestamps: true });

const inventaireSchema = new Schema({
  InventaireID: { type: Schema.Types.ObjectId, auto: true },
  ProduitID: { type: Schema.Types.ObjectId, ref: 'Produit' },
  VendeurID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Quantite: { type: Number, required: true },
});

const paiementSchema = new Schema({
  PaiementID: { type: Schema.Types.ObjectId, auto: true },
  CommandeID: { type: Schema.Types.ObjectId, ref: 'Commande' },
  MethodePaiement: {
    type: String,
    enum: ['Carte de crédit', 'PayPal', 'Virement bancaire'],
  },
  Montant: { type: Number, required: true },
}, { timestamps: true });

const produitSchema = new Schema({
  ProduitID: { type: Schema.Types.ObjectId, auto: true },
  VendeurID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Nom: { type: String, required: true },
  Description: { type: String },
  Prix: { type: Number, required: true },
  Stock: { type: Number, required: true },
  CategorieID: { type: Schema.Types.ObjectId, ref: 'Categorie' },
  Disponible: { type: Boolean, default: true },
}, { timestamps: true });

produitSchema.index({ Nom: 1 });

const utilisateurSchema = new Schema({
  UtilisateurID: { type: Schema.Types.ObjectId, auto: true },
  NomUtilisateur: { type: String, required: true },
  PrenomUtilisateur: { type: String, required: true },
  MotDePasseHash: { type: String, required: true },
  EmailUtilisateur: { type: String, required: true, unique: true },
  NumeroTelephone: { type: String },
  TypeUtilisateur: {
    type: String,
    enum: ['client', 'vendeur', 'admin'],
    required: true,
  },
  avatarImage: { type: String },
}, { timestamps: true });

utilisateurSchema.index({ EmailUtilisateur: 1 });

// Models
const Adresse = mongoose.models.Adresse || mongoose.model('Adresse', adresseSchema);
const Avis = mongoose.models.Avis || mongoose.model('Avis', avisSchema);
const Categorie = mongoose.models.Categorie || mongoose.model('Categorie', categorieSchema);
const CommandeArticle = mongoose.models.CommandeArticle || mongoose.model('CommandeArticle', commandeArticleSchema);
const Commande = mongoose.models.Commande || mongoose.model('Commande', commandeSchema);
const Expedition = mongoose.models.Expedition || mongoose.model('Expedition', expeditionSchema);
const Inventaire = mongoose.models.Inventaire || mongoose.model('Inventaire', inventaireSchema);
const Paiement = mongoose.models.Paiement || mongoose.model('Paiement', paiementSchema);
const Produit = mongoose.models.Produit || mongoose.model('Produit', produitSchema);
const Utilisateur = mongoose.models.Utilisateur || mongoose.model('Utilisateur', utilisateurSchema);

// Define bcrypt salt rounds for password hashing
const saltRounds = 10;

// Data for vendeur utilisateurs
const vendeursData = [
  {
    NomUtilisateur: 'vendeur1',
    PrenomUtilisateur: 'Vendeur',
    MotDePasseHash: bcrypt.hashSync('password1', saltRounds),
    EmailUtilisateur: 'vendeur1@example.com',
    NumeroTelephone: '1234567890',
    TypeUtilisateur: 'vendeur',
    avatarImage: '/avatars/vendeur1.jpg',
  },
  {
    NomUtilisateur: 'vendeur2',
    PrenomUtilisateur: 'Vendeur',
    MotDePasseHash: bcrypt.hashSync('password2', saltRounds),
    EmailUtilisateur: 'vendeur2@example.com',
    NumeroTelephone: '9876543210',
    TypeUtilisateur: 'vendeur',
    avatarImage: '/avatars/vendeur2.jpg',
  },
  // Add more vendeur utilisateurs as needed
];

// Data for produits related to vendeurs
const produitsData = [
  {
    Nom: 'Product 1 by Vendeur 1',
    Description: 'Description for Product 1',
    Prix: 49.99,
    Stock: 100,
    Disponible: true,
  },
  {
    Nom: 'Product 2 by Vendeur 2',
    Description: 'Description for Product 2',
    Prix: 29.99,
    Stock: 50,
    Disponible: true,
  },
  // Add more products related to vendeurs as needed
];

// Data for categories
const categoriesData = [
  {
    Nom: 'Category 1',
    Description: 'Description for Category 1',
  },
  {
    Nom: 'Category 2',
    Description: 'Description for Category 2',
  },
  // Add more categories as needed
];

// Seeder function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Insert vendeur utilisateurs
    const insertedVendeurs = await Utilisateur.insertMany(vendeursData);

    // Map vendeur IDs for use in produitsData
    const vendeurIds = insertedVendeurs.map(vendeur => vendeur._id);

    // Update produitsData with vendeur IDs
    produitsData.forEach((produit, index) => {
      produit.VendeurID = vendeurIds[index % vendeurIds.length]; // Cycle through vendeur IDs
    });

    // Insert produits related to vendeurs
    await Produit.insertMany(produitsData);

    // Insert categories
    const insertedCategories = await Categorie.insertMany(categoriesData);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run seeder function
seedDatabase();
