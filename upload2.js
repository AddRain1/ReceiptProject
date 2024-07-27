const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// function to insert image into database
async function insertImage(connection, name, imagePath) {
    try {
        // Read the image file asynchronously
        const data = await fs.readFile(imagePath);

        // SQL query to insert the image into the database
        const sql = 'INSERT INTO images (name, image_data) VALUES (?, ?)';
        const values = [name, data];

        // Execute the SQL query using the provided database connection
        await connection.query(sql, values);

        // Log success message if insertion is successful
        console.log(`Image ${name} uploaded successfully`);
    } catch (error) {
        console.error(`Error uploading image ${name}:`, error);
    }
}

async function uploadImage() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'adria',
            password: '697203',
            database: 'mydb',
        });
        console.log('Connected to MySQL');

        // create var for directory with the image
        const imagesDirectory = 'images';
        const files = await fs.readdir(imagesDirectory);

        const uploadPromises = files.map(async file => {
            const imagePath = path.join(imagesDirectory, file);
            const stat = await fs.lstat(imagePath);
            if (stat.isFile()) {
                await insertImage(connection, file, imagePath);
            }
        });

        await Promise.all(uploadPromises);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (connection) {
            await connection.end();
            console.log('MySQL connection closed');
        }
    }
}

uploadImage();
