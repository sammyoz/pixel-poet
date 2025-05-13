import * as React from 'react';
import { UploadCloud, Wand2, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LanguageOption } from '@/config/languages';

interface ImageUploadFormProps {
  onImageSelect: (file: File | null) => void;
  onLanguageSelect: (language: string) => void;
  onGenerate: () => void;
  selectedLanguage: string;
  isLoading: boolean;
  languages: LanguageOption[];
  selectedImageName: string | null;
}

export function ImageUploadForm({
  onImageSelect,
  onLanguageSelect,
  onGenerate,
  selectedLanguage,
  isLoading,
  languages,
  selectedImageName,
}: ImageUploadFormProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onImageSelect(file || null);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="image-upload" className="text-sm font-medium text-foreground/80">
          Upload Image
        </Label>
        <div className="mt-2 flex items-center justify-center w-full">
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors"
          >
            {selectedImageName ? (
               <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                 <FileImage className="w-10 h-10 mb-3 text-primary" />
                 <p className="mb-2 text-sm text-foreground"><span className="font-semibold">Selected:</span> {selectedImageName}</p>
                 <p className="text-xs text-muted-foreground">Click to change image</p>
               </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-primary" />
                <p className="mb-2 text-sm text-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
            )}
            <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </Label>
        </div>
      </div>

      <div>
        <Label htmlFor="language-select" className="text-sm font-medium text-foreground/80">
          Poem Language
        </Label>
        <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
          <SelectTrigger id="language-select" className="w-full mt-2">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onGenerate} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Wand2 className="mr-2 h-5 w-5" />
            Generate Poem
          </div>
        )}
      </Button>
    </div>
  );
}
