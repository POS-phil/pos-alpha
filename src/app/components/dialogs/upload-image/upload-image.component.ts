import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatInputModule

  ],
  template: `
    <div class="container">
    
      <h1 mat-dialog-title>Upload Image</h1>
      <div mat-dialog-content>
        <div class="cf">
          <div class="f-50">
            <div
              class="drop-zone"
              (drop)="onDrop($event)"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              [class.active]="isDragOver">
              <p>Drag & Drop Image Here</p>
              <mat-icon class="imgIcon" >add_photo_alternate</mat-icon>
              <div class="or-divider ">OR</div>
              <button mat-flat-button class="btnBrowse" (click)="fileInput.click()">Browse File</button>
              <input type="file" hidden #fileInput (change)="onFileSelected($event)" accept="image/*" />

            </div>
            <div class="or-divider">OR</div>

            <mat-form-field appearance="outline" class="url-field">
              <mat-label>Image URL</mat-label>
              <input matInput [(ngModel)]="imageUrl" placeholder="https://example.com/image.jpg">
              <button mat-icon-button matSuffix (click)="onLoadUrlImage()" aria-label="Preview from URL">
                <mat-icon>preview</mat-icon>
              </button>
            </mat-form-field>

            <p class="note">
              You can upload an image by dragging and dropping it here, selecting a file from your computer, or entering a URL.
            </p>
            

            <!-- <div class="image-preview" *ngIf="previewImage">
              <img [src]="previewImage" alt="Image Preview">
            </div> -->

          </div>
          <div class="f-50">
            <div class="image-preview-container">
              @if(previewImage){
              <div class="image-preview">
                <img [src]="previewImage" alt="Image Preview">
              </div>
              } @else {
                <p class="font-image-preview">Image preview will appear here</p>
                <mat-icon class="imgIcon-preview" >photo</mat-icon>
              }
            </div>
          </div>
        </div>
      </div>  
      
      <div mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="onUpload()" [disabled]="!previewImage">Upload</button>
      </div>
    </div>
  `,
  styles: `

    ::host {
      overflow: hidden;
    }

    h1 {
      font: var(--mat-sys-headline-large);
    }

    .container{
      padding: 16px;
      overflow: hidden;
    }

    .cf {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      height: calc(100vh - 220px);
    }

    @media (max-width: 600px) {

      .cf{
        flex-direction: column;
      }
    
    }

    .f-50{
      flex: 50%;
    }

    .imgIcon{
      width: 60px;
      height: 60px;
      font-size: 50px;
    }

    .imgIcon-preview{
      width: 550px;
      height: 550px;
      font-size: 500px;
    }

    .btnBrowse {
      border-radius: 5px;
      width: 100%;
    }

    .note {
      text-align: center; 
      color: #666;
      font: var(--mat-sys-body-medium);
    }

    .font-image-preview {
      font: var(--mat-sys-display-small);
    }

    .drop-zone {
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 24px;
        text-align: center;
        color: #888;
        transition: border-color 0.3s;
        margin-bottom: 12px;
        cursor: pointer;
        height: 200px;
        justify-content: center;
    }

    .image-preview-container{
      
      border: 2px dashed #ccc;
      border-radius: 8px;
      text-align: center;
      color: #888;
      min-height: 500px;
      min-width: 200px;
    }

    .drop-zone.active {
      border-color: #3f51b5;
      color: #3f51b5;
    }
    .or-divider {
      text-align: center;
      margin: 12px 0;
      font-weight: bold;
      color: #666;
    }
    .url-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .image-preview {
      margin-top: 16px;
      text-align: center;
    }
    
    .image-preview img {
      max-width: 660px;
      max-height: 900px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      margin-bottom: 10px;
    }
  
  `
})
export class UploadImageComponent {

  imageUrl = '';
  previewImage: string | ArrayBuffer | null = null;
  isDragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.readFile(file);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.readFile(file);
    }
  }

  onLoadUrlImage() {
    // Minimal URL validation
    if (this.imageUrl.startsWith('http')) {
      this.previewImage = this.imageUrl;
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onUpload() {
    // Return the image (data URL or URL)
    console.log('Uploading:', this.previewImage);
    // You can send this to a backend or return it to the parent component
  }

}
