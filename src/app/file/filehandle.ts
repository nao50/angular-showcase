import { SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
  discription?: string;
  file: File;
  url: SafeUrl;
}
