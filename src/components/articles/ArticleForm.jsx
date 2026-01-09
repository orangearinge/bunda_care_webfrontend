import { useState, useCallback, memo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RichTextEditor from "@/components/editor/RichTextEditor"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { useArticles } from "@/hooks/useArticles"
import { toast } from "sonner"
import { Loader2, Save, Eye } from "lucide-react"

function ArticleFormInner({ article = null, isEdit = false }) {
    const navigate = useNavigate()
    const { createArticle, updateArticle, isCreating, isUpdating } = useArticles()
    const isLoading = isCreating || isUpdating

    const [formData, setFormData] = useState({
        title: article?.title || "",
        excerpt: article?.excerpt || "",
        content: article?.content || "",
        cover_image: article?.cover_image || "",
        status: article?.status || "draft",
    })
    const [errors, setErrors] = useState({})

    // Handle input changes
    const handleChange = useCallback((field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        setErrors((prev) => {
            if (prev[field]) {
                return { ...prev, [field]: "" }
            }
            return prev
        })
    }, [])

    // Specific handlers to prevent inline function creation
    const handleTitleChange = useCallback((e) => handleChange("title", e.target.value), [handleChange])
    const handleExcerptChange = useCallback((e) => handleChange("excerpt", e.target.value), [handleChange])
    const handleCoverImageChange = useCallback((url) => handleChange("cover_image", url), [handleChange])
    const handleStatusChange = useCallback((value) => handleChange("status", value), [handleChange])
    const handleContentChange = useCallback((html) => {
        setFormData((prev) => ({
            ...prev,
            content: html,
        }))
        setErrors((prev) => {
            if (prev.content) {
                return { ...prev, content: "" }
            }
            return prev
        })
    }, [])

    // Validate form
    const validate = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!formData.content.trim() || formData.content === "<p></p>") {
            newErrors.content = "Content is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) {
            toast.error("Please fix the errors before submitting")
            return
        }

        if (isEdit && article?.id) {
            // Update existing article
            await updateArticle({ id: article.id, data: formData })
        } else {
            // Create new article
            await createArticle(formData)
        }
    }

    // Handle save as draft
    const handleSaveAsDraft = async () => {
        setFormData((prev) => ({ ...prev, status: "draft" }))
        setTimeout(() => {
            document.getElementById("article-form").requestSubmit()
        }, 100)
    }

    // Handle publish
    const handlePublish = async () => {
        setFormData((prev) => ({ ...prev, status: "published" }))
        setTimeout(() => {
            document.getElementById("article-form").requestSubmit()
        }, 100)
    }

    return (
        <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isEdit ? "Edit Article" : "Create New Article"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEdit ? "Update your article content" : "Write and publish your article"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => navigate("/admin/articles")}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveAsDraft}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save as Draft
                    </Button>
                    <Button type="button" onClick={handlePublish} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Eye className="mr-2 h-4 w-4" />
                        )}
                        Publish
                    </Button>
                </div>
            </div>

            {/* Article Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Article Details</CardTitle>
                    <CardDescription>Basic information about your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="Enter article title"
                            value={formData.title}
                            onChange={handleTitleChange}
                            className={errors.title ? "border-destructive" : ""}
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                        <Textarea
                            id="excerpt"
                            placeholder="Brief description of your article (optional)"
                            value={formData.excerpt}
                            onChange={handleExcerptChange}
                            rows={3}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be shown in article previews and listings
                        </p>
                    </div>

                    {/* Cover Image */}
                    <ImageUpload
                        value={formData.cover_image}
                        onChange={handleCoverImageChange}
                        uploadType="article"
                        label="Cover Image"
                    />

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Draft articles are only visible to admins. Published articles are visible to everyone.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Content Editor Card */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Article Content <span className="text-destructive">*</span>
                    </CardTitle>
                    <CardDescription>Write your article using the rich text editor</CardDescription>
                </CardHeader>
                <CardContent>
                    <RichTextEditor
                        key={article?.id || "new-article"}
                        content={formData.content}
                        onChange={handleContentChange}
                        placeholder="Start writing your article content here..."
                    />
                    {errors.content && <p className="text-sm text-destructive mt-2">{errors.content}</p>}
                </CardContent>
            </Card>
        </form>
    )
}

export default memo(ArticleFormInner)
