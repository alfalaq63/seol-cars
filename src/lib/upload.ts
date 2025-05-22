import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const fileName = `${uuidv4()}-${file.name}`;
  const path = join(process.cwd(), 'public/uploads', fileName);
  
  // Save the file
  await writeFile(path, buffer);
  
  // Return the path that can be stored in the database
  return `/uploads/${fileName}`;
}
