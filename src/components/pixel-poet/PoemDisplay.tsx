import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PoemDisplayProps {
  imageUrl: string | null;
  poem: string | null;
  isLoading: boolean;
  appName: string;
}

export function PoemDisplay({ imageUrl, poem, isLoading, appName }: PoemDisplayProps) {
  const [poemRevealed, setPoemRevealed] = React.useState(false);

  React.useEffect(() => {
    if (poem && !isLoading) {
      // Trigger fade-in animation
      setPoemRevealed(false); // Reset to ensure animation re-triggers
      const timer = setTimeout(() => setPoemRevealed(true), 100); // Short delay to allow reset
      return () => clearTimeout(timer);
    } else if (!poem) {
        setPoemRevealed(false);
    }
  }, [poem, isLoading]);

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="p-0">
        {isLoading && !imageUrl && (
          <Skeleton className="w-full h-64 rounded-t-lg" />
        )}
        {imageUrl && (
          <div className="aspect-[4/3] relative w-full rounded-t-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt="Uploaded inspiration"
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-500 ease-in-out"
              data-ai-hint="uploaded image"
            />
          </div>
        )}
        {!imageUrl && !isLoading && (
           <div className="aspect-[4/3] w-full flex flex-col items-center justify-center bg-muted/30 rounded-t-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-muted-foreground/50 mb-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <p className="text-muted-foreground">Your image will appear here</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isLoading && (
          <>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </>
        )}
        {!isLoading && poem && (
          <div className={`transition-opacity duration-700 ease-in-out ${poemRevealed ? 'opacity-100' : 'opacity-0'}`}>
            <CardTitle className="text-2xl font-semibold text-primary mb-2">Generated Poem</CardTitle>
            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed font-serif">{poem}</p>
          </div>
        )}
        {!isLoading && !poem && imageUrl && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Click "Generate Poem" to see the magic!</p>
          </div>
        )}
         {!isLoading && !poem && !imageUrl && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Upload an image and select a language to start.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Let {appName} turn your pixels into poetry.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
