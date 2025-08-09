import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, OnInit, Output, SecurityContext } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogActions,
  ],
  template: `
    <div class="container">
        <h1>Upload Image</h1>
        <div class="grid-container">
          <div>
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
          </div>
          <div>
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
      <mat-dialog-actions>
        <button mat-button mat-dialog-close class="btnRadius-text" (click)="onCancel()">Cancel</button>
        <button matButton="filled" class="btnRadius-filled " (click)="onUpload()" [disabled]="!previewImage">Upload</button>
        <button matButton="filled" class="btnRemove btnRadius-filled " (click)="onRemove()" [disabled]="!previewImage">Remove</button>
      </mat-dialog-actions>
    </div> 
  `,
  styleUrl: './upload-image.scss',
})
export class UploadImageComponent implements OnInit {

  imageUrl = '';
  readonly dialogRef = inject(MatDialogRef<UploadImageComponent>);
  previewImage: SafeUrl | null = null;
  selectedImage: File | null = null;
  isDragOver = false;

  data = inject(MAT_DIALOG_DATA);

  @Output() imageRemoved = new EventEmitter<void>();

  constructor(
    private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    if (this.data) {
      this.previewImage = this.data.previewImage;
      this.selectedImage = this.data.selectedImage;
    }
  }

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
      this.cleanUpObjectUrl();
      this.selectedImage = file;
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      // console.log('File dropped:', file);
      // console.log('Preview URL:', this.previewImage);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.cleanUpObjectUrl();
      this.selectedImage = file;
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      // console.log('File dropped:', file);
      // console.log('Preview URL:', this.previewImage);
    }
  }

  async onLoadUrlImage() {
    try {
      const response = await fetch(this.imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');

      this.cleanUpObjectUrl();

      const blob = await response.blob();

      //Fix
      const maxSizeMB = 10;
      if (blob.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File is too large. Max size is ${maxSizeMB}MB`);
      }

      const image = await this.loadImageFromBlob(blob);
      if (image.width < 660 || image.height < 900) {
        throw new Error(`Image must be at least 660x900 pixels`);
      }

      let fileName = this.imageUrl.split('/').pop() || 'downloaded-image.jpg';
      fileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');

      this.selectedImage = new File([blob], fileName, { type: blob.type });
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(blob)
      );

      console.log('File dropped:', this.selectedImage);
      console.log('Preview URL:', this.previewImage);

    } catch (error) {
      console.error('Error loading image from URL:', error);
    }

  }

  private loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Invalid image'));
    img.src = URL.createObjectURL(blob);
  });
}

  onUpload() {
    //console.log('Uploading:', this.previewImage);
    this.dialogRef.close({
      previewImage: this.previewImage,
      selectedImage: this.selectedImage
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  private cleanUpObjectUrl(): void {
    if (this.previewImage) {
      const unsafeUrl = this.sanitizer.sanitize(SecurityContext.URL, this.previewImage);
      if (unsafeUrl) {
        window.URL.revokeObjectURL(unsafeUrl);
      }
      this.previewImage = null;
    }
  }

  onRemove() {
    this.cleanUpObjectUrl();
    this.previewImage = null;
    this.selectedImage = null;
    this.imageRemoved.emit();
  }

}
