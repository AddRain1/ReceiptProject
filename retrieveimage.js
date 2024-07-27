const mysql = require('mysql2/promise');
const fs = require('fs/promises');
const path = require('path');

// function to restore and store image
async function retrieveImages() {
    // connect to mysql database
    let connection;
    try {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'adria',
        password: '697203',
        database: 'mydb'
    });

    const [rows, fields] = await connection.execute('SELECT * FROM images');

    if (rows.length > 0) {

        // define the directory to store the images
        const directoryPath = 'received';

        // Ensure directry exists
        await fs.mkdir(directoryPath, {recursive: true});

        // Save each image to directory
        for (const row of rows) {
            const { id, name, image_data } = row;
            const filePath = path.join(directoryPath, name);
            await fs.writeFile(filePath, image_data);
            console.log(`Image with ID ${id} successfully written to file at ${filePath}`);
        }
        
    } else {
        console.log('No images found in the databse');
    }
    } catch (error) {
        console.error('Error: ', error);
    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log('MySQL connection closed');
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        } else {
            console.log('Connection was not established.');
        }
    }
}

retrieveImages();
