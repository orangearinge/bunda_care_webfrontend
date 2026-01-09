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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
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

const MenuBar = ({ editor }) => {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [linkUrl, setLinkUrl] = useState("")
    const [linkText, setLinkText] = useState("")

    if (!editor) {
        return null
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl("")
            setImageDialogOpen(false)
        }
    }

    const addLink = () => {
        if (linkUrl) {
            if (linkText) {
                editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
            } else {
                editor.chain().focus().setLink({ href: linkUrl }).run()
            }
            setLinkUrl("")
            setLinkText("")
            setLinkDialogOpen(false)
        }
    }

    const MenuButton = ({ onClick, isActive, children, title }) => (
        <Button
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            title={title}
            className={cn("h-8 w-8 p-0", isActive && "bg-primary text-primary-foreground")}
        >
            {children}
        </Button>
    )

    return (
        <div className="border-b border-border p-2 flex flex-wrap gap-1">
            {/* Text Formatting */}
            <div className="flex gap-1 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Headings */}
            <div className="flex gap-1 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Lists */}
            <div className="flex gap-1 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Alignment */}
            <div className="flex gap-1 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Code Block */}
            <div className="flex gap-1 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    title="Code Block"
                >
                    <Code className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Image & Link */}
            <div className="flex gap-1 mr-2">
                <MenuButton onClick={() => setImageDialogOpen(true)} title="Insert Image">
                    <ImageIcon className="h-4 w-4" />
                </MenuButton>

                <MenuButton onClick={() => setLinkDialogOpen(true)} title="Insert Link">
                    <LinkIcon className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Undo/Redo */}
            <div className="flex gap-1">
                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                        <DialogDescription>Enter the URL of the image you want to insert.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        addImage()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={addImage}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Link Dialog */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Link</DialogTitle>
                        <DialogDescription>Add a link to your content.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="linkUrl">URL</Label>
                            <Input
                                id="linkUrl"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="linkText">Link Text (Optional)</Label>
                            <Input
                                id="linkText"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                placeholder="Click here"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        addLink()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={addLink}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default function RichTextEditor({ content, onChange, placeholder = "Start writing your article..." }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg my-4",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4",
            },
        },
    })

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-background">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
