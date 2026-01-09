import { useEffect, useRef, useState, useCallback } from "react"
import { IconUpload, IconX, IconPhoto, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import imageCompression from "browser-image-compression"
import { toast } from "sonner"
import { getCloudinaryFolder, isValidUploadType, CLOUDINARY_CONFIG } from "@/constants/cloudinary"

/**
 * ImageUpload component with dynamic folder selection
 * @param {Object} props - Component props
 * @param {string} props.value - Current image URL
 * @param {Function} props.onChange - Callback when image changes
 * @param {boolean} props.disabled - Whether the upload is disabled
 * @param {('avatar'|'menu')} props.uploadType - Type of upload (affects folder selection)
 * @param {string} props.label - Custom label for the upload field
 */
export function ImageUpload({
    value,
    onChange,
    disabled,
    uploadType = 'menu',
    label = uploadType === 'avatar' ? 'Avatar' : 'Image'
}) {
    // Validate upload type
    if (!isValidUploadType(uploadType)) {
        throw new Error(`Invalid uploadType: ${uploadType}. Must be 'avatar' or 'menu'`)
    }

    const [imageUrl, setImageUrl] = useState(value || "")
    const [isUploading, setIsUploading] = useState(false)
    const widgetRef = useRef(null)
    const fileInputRef = useRef(null)

    // Get the appropriate folder for this upload type
    const uploadFolder = getCloudinaryFolder(uploadType)

    useEffect(() => {
        setImageUrl(value || "")
    }, [value])

    useEffect(() => {
        // Initialize Cloudinary Upload Widget with compression settings
        // Only run once on mount, not when onChange changes
        if (window.cloudinary && !widgetRef.current) {
            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
                    uploadPreset: CLOUDINARY_CONFIG.UPLOAD_PRESET,
                    sources: ["local", "url", "camera"],
                    multiple: false,
                    maxFiles: 1,
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                    maxFileSize: 5000000, // 5MB
                    cropping: true,
                    croppingAspectRatio: uploadType === 'avatar' ? 1 : (uploadType === 'article' ? 1.91 : 1.5),
                    folder: uploadFolder,
                    transformation: [
                        {
                            width: uploadType === 'avatar' ? 400 : (uploadType === 'article' ? 1200 : 800),
                            height: uploadType === 'avatar' ? 400 : (uploadType === 'article' ? 630 : 800),
                            crop: "limit"
                        },
                        { quality: "auto:good" },
                        { fetch_format: "auto" }
                    ],
                },
                (error, result) => {
                    if (!error && result && result.event === "success") {
                        const url = result.info.secure_url
                        setImageUrl(url)
                        onChange(url)
                        toast.success("Image uploaded successfully!")
                    } else if (error) {
                        toast.error("Failed to upload image")
                        console.error("Upload error:", error)
                    }
                }
            )
        }
    }, []) // Empty dependency - only run once on mount

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1, // Maximum file size 1MB
            maxWidthOrHeight: 1024, // Maximum dimension
            useWebWorker: true,
            fileType: "image/jpeg", // Convert to JPEG for better compression
            initialQuality: 0.8, // Good quality with compression
        }

        try {
            const compressedFile = await imageCompression(file, options)
            const originalSizeMB = (file.size / 1024 / 1024).toFixed(2)
            const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2)

            console.log(`Original size: ${originalSizeMB}MB`)
            console.log(`Compressed size: ${compressedSizeMB}MB`)
            console.log(`Reduction: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`)

            toast.success(`Image compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`)
            return compressedFile
        } catch (error) {
            console.error("Compression error:", error)
            toast.error("Failed to compress image")
            throw error
        }
    }

    const uploadToCloudinary = async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET)
        formData.append("folder", uploadFolder)

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            return data.secure_url
        } catch (error) {
            console.error("Upload error:", error)
            throw error
        }
    }

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        // Validate file size (max 10MB before compression)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File too large. Maximum size is 10MB")
            return
        }

        // Log upload info for debugging
        console.log(`Uploading ${uploadType} to folder: ${uploadFolder}`)

        setIsUploading(true)
        try {
            // Compress image
            toast.info("Compressing image...")
            const compressedFile = await compressImage(file)

            // Upload to Cloudinary
            toast.info("Uploading image...")
            const url = await uploadToCloudinary(compressedFile)

            setImageUrl(url)
            onChange(url)
            toast.success("Image uploaded successfully!")
        } catch (error) {
            toast.error("Failed to upload image")
            console.error("Upload process error:", error)
        } finally {
            setIsUploading(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleUploadClick = () => {
        if (!disabled && !isUploading) {
            fileInputRef.current?.click()
        }
    }

    const handleRemove = () => {
        setImageUrl("")
        onChange("")
        toast.success("Image removed")
    }

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="flex items-start gap-4">
                {imageUrl ? (
                    <div className="relative group">
                        <img
                            src={imageUrl}
                            alt={`${label} preview`}
                            className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemove}
                            disabled={disabled || isUploading}
                        >
                            <IconX className="size-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                        {isUploading ? (
                            <IconLoader2 className="size-8 text-muted-foreground animate-spin" />
                        ) : (
                            <IconPhoto className="size-8 text-muted-foreground" />
                        )}
                    </div>
                )}
                <div className="flex-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={disabled || isUploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleUploadClick}
                        disabled={disabled || isUploading}
                        className="w-full"
                    >
                        {isUploading ? (
                            <>
                                <IconLoader2 className="mr-2 size-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <IconUpload className="mr-2 size-4" />
                                {imageUrl ? "Change Image" : "Upload Image"}
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Image will be compressed automatically. Max 10MB (JPG, PNG, WebP)
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Compressed to ~1MB and resized to 1024x1024px max
                    </p>
                </div>
            </div>
        </div>
    )
}
