import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove?: (value: string) => void;
  value: string[];
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value = [],
  multiple = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    const newUrl = result.info.secure_url;
    console.log("Uploaded URL:", newUrl);

    if (multiple) {
      onChange([...value, newUrl]);
    } else {
      onChange([newUrl]);
    }
  };

  if (!isMounted) {
    return null;
  }

  const handleRemove = (url: string) => {
    console.log("Removing URL:", url);
    if (onRemove) {
      onRemove(url);
    } else {
      onChange(value.filter(v => v !== url));
    }
  };

  const renderImages = (urls: string[]) => {
    return urls.map((url) => (
      <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
        <div className="z-10 absolute top-2 right-2">
          <Button 
            type="button"
            onClick={() => handleRemove(url)}
            variant="destructive"
            size="icon"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <Image
          fill
          className="object-cover"
          alt="img"
          src={url}
        />
      </div>
    ));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {renderImages(value)}
      </div>
      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset="kylfnsll"
        options={{ multiple: multiple }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Upload Image{multiple && 's'}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
