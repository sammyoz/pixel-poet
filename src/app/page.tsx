'use client';

import * as React from 'react';
import { generatePoem, type GeneratePoemInput, type GeneratePoemOutput } from '@/ai/flows/generate-poem';
import { ImageUploadForm } from '@/components/pixel-poet/ImageUploadForm';
import { PoemDisplay } from '@/components/pixel-poet/PoemDisplay';
import { languages as languageOptions, type LanguageOption } from '@/config/languages';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const APP_NAME = "PixelPoet";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function PixelPoetPage() {
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  // The first language in languageOptions is now English.
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(languageOptions[0].value);
  const [generatedPoem, setGeneratedPoem] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedImageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(objectUrl);
    // Clean up the object URL on component unmount or when file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImageFile]);

  const handleImageSelect = (file: File | null) => {
    setSelectedImageFile(file);
    // Reset previous results when a new image is selected
    setGeneratedPoem(null);
    setError(null);
  };

  const handleLanguageSelect = (languageValue: string) => {
    setSelectedLanguage(languageValue);
  };

  const handleGeneratePoem = async () => {
    if (!selectedImageFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPoem(null);

    try {
      const photoDataUri = await fileToDataUri(selectedImageFile);
      const input: GeneratePoemInput = { photoDataUri, language: selectedLanguage };
      const result: GeneratePoemOutput = await generatePoem(input);
      setGeneratedPoem(result.poem);
    } catch (err) {
      console.error('Error generating poem:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate poem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col selection:bg-accent/30 selection:text-accent-foreground">
      <header className="my-8 text-center">
        <h1 className="text-5xl font-bold text-primary tracking-tight">
          {APP_NAME}
        </h1>
        <p className="text-foreground/90 mt-3 text-lg">
          Transform your images into beautiful poetry in any language with AI.
        </p>
      </header>

      <main className="flex-grow grid md:grid-cols-5 gap-8 items-start">
        <section className="md:col-span-2 space-y-6 p-6 bg-card rounded-xl shadow-lg">
          <ImageUploadForm
            onImageSelect={handleImageSelect}
            onLanguageSelect={handleLanguageSelect}
            onGenerate={handleGeneratePoem}
            selectedLanguage={selectedLanguage}
            isLoading={isLoading}
            languages={languageOptions}
            selectedImageName={selectedImageFile?.name || null}
            imagePreviewUrl={imagePreviewUrl}
          />
        </section>

        <section className="md:col-span-3 space-y-6">
          {error && (
            <Alert variant="destructive" className="shadow-md">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <PoemDisplay
            poem={generatedPoem}
            isLoading={isLoading}
            appName={APP_NAME}
          />
        </section>
      </main>

      <footer className="text-center py-8 mt-12 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. Crafted with pixels and passion.</p>
      </footer>
    </div>
  );
}
