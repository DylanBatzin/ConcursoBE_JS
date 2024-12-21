import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith('image/')) {
            cb(null, true); 
        } else {
            cb(new Error('Solo se permiten archivos de tipo imagen (jpeg, png, etc.)'), false);
        }
    },
});

export const uploadSingleImage = upload.single('image'); 


export const uploadMultipleImages = upload.array('images', 5); 