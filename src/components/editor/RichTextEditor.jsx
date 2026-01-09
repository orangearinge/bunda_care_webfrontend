import { useEffect, useRef, useMemo, memo, useState, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Image as ImageIcon,
    Link as LinkIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Code,
    Undo,
    Redo,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CLOUDINARY_CONFIG, getCloudinaryFolder } from "@/constants/cloudinary"
import { toast } from "sonner"

// Static definition of extensions to prevent re-creation
const STATIC_EXTENSIONS = [
    StarterKit.configure({
        heading: { levels: [1, 2, 3] },
    }),
    Underline,
    Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg my-4 mx-auto block" },
    }),
    Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline font-medium" },
    }),
    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
]

// Memoized MenuBar
const MenuBar = memo(({ editor }) => {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [linkUrl, setLinkUrl] = useState("")
    const [linkText, setLinkText] = useState("")

    if (!editor) return null

    const addImage = (url) => {
        const finalUrl = url || imageUrl
        if (finalUrl) {
            editor.chain().focus().setImage({ src: finalUrl }).run()
            setImageUrl("")
            setImageDialogOpen(false)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET)
        formData.append("folder", getCloudinaryFolder("article"))
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            addImage(data.secure_url)
            toast.success("Image uploaded")
        } catch (err) {
            toast.error("Upload failed")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="border-b border-border p-2 flex flex-wrap gap-1 sticky top-0 bg-background z-10">
            <div className="flex gap-1 mr-2 border-r pr-2">
                <Button type="button" variant={editor.isActive("bold") ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-primary text-primary-foreground")}><Bold className="h-4 w-4" /></Button>
                <Button type="button" variant={editor.isActive("italic") ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-primary text-primary-foreground")}><Italic className="h-4 w-4" /></Button>
                <Button type="button" variant={editor.isActive("underline") ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} className={cn("h-8 w-8 p-0", editor.isActive("underline") && "bg-primary text-primary-foreground")}><UnderlineIcon className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-1 mr-2 border-r pr-2">
                <Button type="button" variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 1 }) && "bg-primary text-primary-foreground")}><Heading1 className="h-4 w-4" /></Button>
                <Button type="button" variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-primary text-primary-foreground")}><Heading2 className="h-4 w-4" /></Button>
                <Button type="button" variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 3 }) && "bg-primary text-primary-foreground")}><Heading3 className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-1 mr-2 border-r pr-2">
                <Button type="button" variant={editor.isActive("bulletList") ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-primary text-primary-foreground")}><List className="h-4 w-4" /></Button>
                <Button type="button" variant={editor.isActive("orderedList") ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-primary text-primary-foreground")}><ListOrdered className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-1 mr-2 border-r pr-2">
                <Button type="button" variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: "left" }) && "bg-primary text-primary-foreground")}><AlignLeft className="h-4 w-4" /></Button>
                <Button type="button" variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: "center" }) && "bg-primary text-primary-foreground")}><AlignCenter className="h-4 w-4" /></Button>
                <Button type="button" variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"} size="sm" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: "right" }) && "bg-primary text-primary-foreground")}><AlignRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-1 mr-2 border-r pr-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setImageDialogOpen(true)} className="h-8 w-8 p-0"><ImageIcon className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setLinkDialogOpen(true)} className="h-8 w-8 p-0"><LinkIcon className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="h-8 w-8 p-0" title="Code Block"><Code className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="h-8 w-8 p-0"><Undo className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="h-8 w-8 p-0"><Redo className="h-4 w-4" /></Button>
            </div>

            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Insert Image</DialogTitle></DialogHeader>
                    <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload">Upload</TabsTrigger>
                            <TabsTrigger value="url">By URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="space-y-4 py-4">
                            <Label>Upload from computer</Label>
                            <div className="flex items-center gap-4">
                                <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                                {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                            </div>
                        </TabsContent>
                        <TabsContent value="url" className="space-y-4 py-4">
                            <Label>Image URL</Label>
                            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                            <Button className="w-full mt-2" onClick={() => addImage()} disabled={!imageUrl}>Insert</Button>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter><Button variant="outline" onClick={() => setImageDialogOpen(false)}>Cancel</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Insert Link</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>URL</Label>
                        <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
                        <Label>Text</Label>
                        <Input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Optional" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => { if (linkUrl) { editor.chain().focus().setLink({ href: linkUrl }).run(); setLinkUrl(""); setLinkDialogOpen(false); } }}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
})
MenuBar.displayName = "MenuBar"

const RichTextEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
    const isInitialized = useRef(false)
    const contentRef = useRef(content)
    const shouldUpdateRef = useRef(false)

    const extensions = useMemo(() => [
        ...STATIC_EXTENSIONS,
        Placeholder.configure({ placeholder }),
    ], [placeholder])

    const editor = useEditor({
        extensions,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-6",
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            shouldUpdateRef.current = true
            onChange(html)
        },
    }, [])

    useEffect(() => {
        if (editor && !isInitialized.current) {
            if (content) {
                editor.commands.setContent(content, false)
            }
            isInitialized.current = true
            contentRef.current = content
        }
    }, [editor])

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-background article-editor min-h-[450px] flex flex-col">
            <style dangerouslySetInnerHTML={{
                __html: `
                .article-editor .ProseMirror h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; margin-top: 1.5rem; }
                .article-editor .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.25rem; }
                .article-editor .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
                .article-editor .ProseMirror ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; display: block !important; }
                .article-editor .ProseMirror ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; display: block !important; }
                .article-editor .ProseMirror li { display: list-item !important; margin-bottom: 0.25rem; }
                .article-editor .ProseMirror p { margin-bottom: 1rem; line-height: 1.6; }
                .article-editor .ProseMirror { outline: none !important; caret-color: currentColor !important; }
                .article-editor .ProseMirror img { border-radius: 0.5rem; margin: 1.5rem auto; transition: opacity 0.2s; }
                .article-editor .ProseMirror img:hover { opacity: 0.9; cursor: pointer; }
                .article-editor .ProseMirror:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }
            `}} />
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

function areEqual(prevProps, nextProps) {
    if (prevProps.onChange !== nextProps.onChange) return false
    if (prevProps.placeholder !== nextProps.placeholder) return false
    return true
}

export default memo(RichTextEditor, areEqual)
