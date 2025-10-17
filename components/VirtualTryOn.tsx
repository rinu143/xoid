import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Product } from '../types';

// Helper function to convert a file to a base64 generative part
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// New helper function to fetch an image from a URL and convert it to a generative part
const urlToGenerativePart = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}. Status: ${response.status}`);
  }
  const blob = await response.blob();
  const mimeType = blob.type;
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType },
  };
};


// --- Sub-components for different states ---

const LoadingState: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
        "Analyzing your photo...",
        "Extracting the XOID tee...",
        "Applying photorealistic lighting...",
        "Finalizing your virtual fit...",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full text-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex space-x-1.5 mb-5">
                <span className="w-2.5 h-2.5 bg-black rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-black rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-black rounded-full animate-pulse"></span>
            </div>
            <p className="text-sm text-black font-medium">{messages[messageIndex]}</p>
        </div>
    );
};

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50/80">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="font-bold text-black">Try-On Failed</h3>
        <p className="text-gray-700 text-xs mt-1 max-w-xs">{error}</p>
    </div>
);

const ImageFrame: React.FC<{ 
  title: string; 
  src?: string | null; 
  children?: React.ReactNode;
  onDismiss?: () => void;
  showAnimation?: boolean;
}> = ({ title, src, children, onDismiss, showAnimation }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, [showAnimation]);
  
  const animationClasses = showAnimation
    ? `transition-all duration-700 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`
    : '';

  return (
    <div className={`flex flex-col items-center w-full ${animationClasses}`}>
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.07),_0_1px_2px_rgba(0,0,0,0.05)] border border-gray-200/50">
        {src && <img src={src} alt={title} className="w-full h-full object-cover"/>}
        {children}
        {onDismiss && (
          <button 
            onClick={onDismiss}
            aria-label="Dismiss and start over"
            className="absolute top-3 right-3 z-10 p-1.5 bg-white/50 backdrop-blur-sm rounded-full text-black hover:bg-white/80 transition-all transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <span className="mt-3 text-xs font-bold text-gray-500 tracking-widest uppercase">{title}</span>
    </div>
  );
};


// --- Main VirtualTryOn Component ---

const VirtualTryOn: React.FC<{ product: Product }> = ({ product }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) {
        setError('Image size should be less than 4MB.');
        setUserImage(null); // Clear any preview if a large file is selected
        return;
      }
      setUserImage(URL.createObjectURL(file));
      setGeneratedImage(null);
      setError(null);
      await generateImage(file);
    }
  };

  const generateImage = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const userImagePart = await fileToGenerativePart(file);
      const tshirtImagePart = await urlToGenerativePart(product.imageUrls[0]);

      const prompt = `You are an expert virtual try-on AI. You will be given a 'model image' and a 'garment image'. Your task is to create a new photorealistic image where the person from the 'model image' is wearing the clothing from the 'garment image'.

**Crucial Rules:**
1.  **Complete Garment Replacement:** You MUST completely REMOVE and REPLACE the clothing item worn by the person in the 'model image' with the new garment. No part of the original clothing (e.g., collars, sleeves, patterns) should be visible in the final image.
2.  **Preserve the Model:** The person's face, hair, body shape, and pose from the 'model image' MUST remain unchanged.
3.  **Preserve the Background:** The entire background from the 'model image' MUST be preserved perfectly.
4.  **Apply the Garment:** Realistically fit the new garment onto the person. It should adapt to their pose with natural folds, shadows, and lighting consistent with the original scene.
5.  **Output:** Return ONLY the final, edited image. Do not include any text.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [userImagePart, tshirtImagePart, { text: prompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
      
      if (imagePart && imagePart.inlineData) {
        const base64ImageBytes = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        setGeneratedImage(`data:${mimeType};base64,${base64ImageBytes}`);
      } else {
         const textPart = response.text.trim();
         setError(textPart || 'Could not generate try-on image. The model may have refused the request. Please try a different photo.');
         setGeneratedImage(null);
      }

    } catch (e) {
      console.error(e);
      let errorMessage = 'An error occurred while generating the image. Please check your connection and try again.';
      if (e instanceof Error && e.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Could not fetch the product image due to a network or CORS issue. This can happen in some browser environments.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleReset = () => {
    setUserImage(null);
    setGeneratedImage(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `XOID_FIT_${product.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a mock event object to pass to handleFileChange
      handleFileChange({ target: { files: e.dataTransfer.files } } as any);
      e.dataTransfer.clearData();
    }
  };
  
  const uploaderClasses = `
    flex flex-col items-center justify-center p-8 h-64 bg-gray-50 
    border-2 border-dashed border-gray-300 rounded-xl cursor-pointer 
    hover:bg-gray-100 hover:border-gray-400 transition-all duration-300
    ${isDragging ? 'bg-gray-100 border-black scale-105' : ''}
  `;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      {!userImage ? (
        <div 
          onClick={triggerFileSelect}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          className={uploaderClasses}
          role="button"
          aria-label="Upload a photo for virtual try-on"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-semibold text-black">Upload Your Photo</span>
          <span className="text-sm text-gray-500 mt-1">Click or drag & drop to begin</span>
           {error && <p className="mt-4 text-xs text-center text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <ImageFrame title="BEFORE" src={userImage} showAnimation={true} />
                <ImageFrame 
                  title="AFTER" 
                  onDismiss={generatedImage && !isLoading ? handleReset : undefined}
                  showAnimation={true}
                >
                    {generatedImage && !isLoading && (
                        <img src={generatedImage} alt="Generated Try-On" className="w-full h-full object-cover"/>
                    )}
                    {isLoading && <LoadingState />}
                    {error && !isLoading && <ErrorState error={error} />}
                </ImageFrame>
            </div>

            {/* Controls */}
             <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-gray-200/80">
                {generatedImage && !isLoading && (
                     <button
                        onClick={handleDownload}
                        className="w-full sm:w-auto flex items-center justify-center bg-white text-black border border-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-sm"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Fit
                      </button>
                )}
              <button
                onClick={handleReset}
                className="w-full sm:w-auto bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-sm"
              >
                Try Another Photo
              </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualTryOn;