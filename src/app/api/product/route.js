// import { ProductModel } from '@/model/product-model';
// import { dbConnect } from '@/service/mongo';
// import cloudinary from '@/utlis/cloudinary';
// import upload from '@/utlis/multer';
// import { nextConnect } from 'next-connect';

// const handler = nextConnect();

// handler.use(upload.single('image'));

// handler.post(async (req, res) => {
//   try {
//     // Connect to the database
//     await dbConnect();

//     // Upload image to Cloudinary (check your setup for the correct path)
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: 'products',
//     });

//     // Validate request body (optional, but recommended for security)
//     const { title, description, longDescription } = req.body;
//     // Add validation logic here

//     // Create new product
//     const product = new ProductModel({
//       title,
//       description,
//       longDescription,
//       image: result.secure_url,
//     });

//     await product.save();

//     res.status(201).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// export default handler;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
