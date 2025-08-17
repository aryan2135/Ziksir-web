# Upload Middleware for Request Images

This middleware handles image uploads specifically for equipment requests in the Ziksir backend.

## Features

- **Image-only uploads**: Accepts only image files (jpg, jpeg, png, gif, webp)
- **Automatic file organization**: Stores files in `uploads/requests/` directory
- **Unique filenames**: Generates unique filenames with timestamps
- **File size limits**: Maximum 5MB per image
- **File count limits**: Only 1 image per request
- **Automatic cleanup**: Deletes old images when updating/deleting requests

## Usage

### 1. Basic Image Upload

```typescript
import { uploadRequestImage, handleUploadError } from '../middlewares/uploadMiddleware';

// In your routes
router.post('/', uploadRequestImage, handleUploadError, (req, res) => {
  // Handle the request
});
```

### 2. Frontend Form Example

```html
<form action="/api/requests" method="POST" enctype="multipart/form-data">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="text" name="type" placeholder="Equipment Type" required>
  <input type="text" name="equipmentModel" placeholder="Equipment Model">
  <input type="text" name="link" placeholder="Product Link">
  <input type="file" name="image" accept="image/*" required>
  <button type="submit">Submit Request</button>
</form>
```

### 3. JavaScript/Fetch Example

```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('type', 'Microscope');
formData.append('equipmentModel', 'Olympus BX53');
formData.append('link', 'https://example.com/microscope');
formData.append('image', imageFile); // File object from input

fetch('/api/requests', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## API Endpoints

### POST /api/requests
Creates a new equipment request with optional image upload.

**Request Body (multipart/form-data):**
- `name` (string, required): Name of the requester
- `type` (string, required): Type of equipment
- `equipmentModel` (string, optional): Model of the equipment
- `link` (string, optional): Product link
- `image` (file, optional): Image file (max 5MB)

**Response:**
```json
{
  "id": "request_id",
  "name": "John Doe",
  "type": "Microscope",
  "equipmentModel": "Olympus BX53",
  "link": "https://example.com/microscope",
  "imageUrl": "http://localhost:3000/uploads/requests/request-image-1234567890-123456789.jpg",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/requests/:id
Updates an existing equipment request with optional image upload.

**Request Body (multipart/form-data):**
- Same fields as POST, all optional
- If new image is uploaded, old image is automatically deleted

### DELETE /api/requests/:id
Deletes an equipment request and its associated image.

## File Storage

- **Directory**: `backend/uploads/requests/`
- **File naming**: `request-image-{timestamp}-{random}.{extension}`
- **URL format**: `{baseUrl}/uploads/requests/{filename}`

## Error Handling

The middleware automatically handles common upload errors:

- **File too large**: Returns 400 with "Image size should not exceed 5MB"
- **Invalid file type**: Returns 400 with "Only image files are allowed"
- **Too many files**: Returns 400 with "Only 1 image allowed per request"

## Utility Functions

```typescript
import { 
  getImageUrl, 
  deleteImageFile, 
  hasImageFile, 
  getFileInfo 
} from '../middlewares/uploadMiddleware';

// Get full URL for an uploaded image
const imageUrl = getImageUrl(req, filename);

// Delete an image file
await deleteImageFile(imageUrl);

// Check if request has an image file
const hasImage = hasImageFile(req);

// Get file information
const fileInfo = getFileInfo(req);
```

## Security Features

- **File type validation**: Only allows image files
- **File size limits**: Prevents large file uploads
- **Unique filenames**: Prevents filename conflicts
- **Automatic cleanup**: Removes old files when updating/deleting

## Dependencies

- `multer`: File upload handling
- `fs`: File system operations
- `path`: Path manipulation utilities

## Installation

The required dependencies are already added to `package.json`:

```bash
npm install
# or
yarn install
```

## Notes

- Images are stored locally in the `uploads/requests/` directory
- The middleware automatically creates the directory structure if it doesn't exist
- Old images are automatically deleted when updating requests with new images
- All file operations are asynchronous and handle errors gracefully
