import { Category } from "@/model/category-model";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { dbConnect } from "@/service/mongo";



export async function getCategories() {
    await dbConnect();
    const categories = await Category.find({}).lean();
  
    return replaceMongoIdInArray(categories);
 
}

async function insertDemoData() {
    await dbConnect();

    // Define demo categories
    const demoCategories = [
        {
            name: 'Electronics',
            thumbnail: 'https://example.com/thumbnails/electronics.jpg',
        },
        {
            name: 'Books',
            thumbnail: 'https://example.com/thumbnails/books.jpg',
        },
        {
            name: 'Clothing',
            thumbnail: 'https://example.com/thumbnails/clothing.jpg',
        },
        {
            name: 'Toys',
            thumbnail: 'https://example.com/thumbnails/toys.jpg',
        },
    ];

    // Insert demo categories into the database
    try {
        await Category.insertMany(demoCategories);
       
    } catch (error) {
        console.error('Error inserting demo data:', error);
    }
}

