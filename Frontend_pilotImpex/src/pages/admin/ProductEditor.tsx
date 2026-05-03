import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CatalogErrorState, CatalogLoadingState } from "@/components/CatalogState";
import { useCatalog } from "@/hooks/useCatalog";
import { saveProduct, uploadProductImage } from "./adminApi";
import { duplicateProductSlug, findProduct, slugify, syncCatalogCache } from "./adminUtils";

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageSize = 5 * 1024 * 1024;
const numericText = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number.isFinite(Number(value)), `${label} must be a number.`);

const productSchema = z.object({
  groupSlug: z.string().trim().min(1, "Product group is required."),
  name: z.string().trim().min(1, "Product name is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  description: z.string().trim().optional(),
  category: z.string().trim().optional(),
  price: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  moq: z.string().trim().optional(),
  purity: z.string().trim().optional(),
  purityValue: numericText("Purity value"),
  order: numericText("Display order"),
  inStock: z.boolean(),
  caution: z.string().trim().optional(),
  applications: z.array(z.object({ value: z.string().trim().optional() })),
  specifications: z.array(
    z.object({
      characteristic: z.string().trim().optional(),
      specification: z.string().trim().optional(),
    })
  ),
});

type ProductForm = z.infer<typeof productSchema>;

function defaultProductForm(groupSlug = ""): ProductForm {
  return {
    groupSlug,
    name: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    unit: "",
    moq: "",
    purity: "",
    purityValue: "",
    order: "",
    inStock: true,
    caution: "",
    applications: [{ value: "" }],
    specifications: [{ characteristic: "", specification: "" }],
  };
}

export default function ProductEditor() {
  const { slug } = useParams<{ slug: string }>();
  const isEditing = Boolean(slug);
  const { data: catalog, isError, isLoading, refetch } = useCatalog();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const product = useMemo(() => findProduct(catalog, slug), [catalog, slug]);
  const groups = useMemo(() => catalog?.groups ?? [], [catalog?.groups]);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductForm(groups[0]?.slug || ""),
  });

  const applications = useFieldArray({ control: form.control, name: "applications" });
  const specifications = useFieldArray({ control: form.control, name: "specifications" });

  useEffect(() => {
    if (!catalog) return;
    if (product) {
      form.reset({
        groupSlug: product.groupSlug,
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        category: product.category || "",
        price: product.price || "",
        unit: product.unit || "",
        moq: product.moq || "",
        purity: product.purity || "",
        purityValue: product.purityValue === undefined ? "" : String(product.purityValue),
        order: product.order ? String(product.order) : "",
        inStock: product.inStock ?? true,
        caution: product.caution || "",
        applications: product.applications?.length ? product.applications.map((value) => ({ value })) : [{ value: "" }],
        specifications: product.specifications?.length
          ? product.specifications.map((item) => ({
              characteristic: item.characteristic,
              specification: item.specification,
            }))
          : [{ characteristic: "", specification: "" }],
      });
      return;
    }

    if (!isEditing && groups[0]) {
      form.reset(defaultProductForm(groups[0].slug));
    }
  }, [catalog, form, groups, isEditing, product]);

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageFile(null);
      return;
    }
    if (!imageMimeTypes.has(file.type)) {
      toast.error("Choose a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > maxImageSize) {
      toast.error("Product image must be 5 MB or smaller.");
      return;
    }
    setImageFile(file);
  };

  const onSubmit = async (values: ProductForm) => {
    if (!catalog) return;
    const nextSlug = slugify(values.slug);
    if (duplicateProductSlug(catalog, nextSlug, slug)) {
      form.setError("slug", { message: "Another product already uses this slug." });
      return;
    }

    setSaving(true);
    try {
      let nextCatalog = await saveProduct(
        {
          groupSlug: values.groupSlug,
          name: values.name.trim(),
          slug: nextSlug,
          description: values.description || undefined,
          category: values.category || undefined,
          price: values.price || undefined,
          unit: values.unit || undefined,
          moq: values.moq || undefined,
          purity: values.purity || undefined,
          purityValue: values.purityValue || undefined,
          order: values.order || undefined,
          inStock: values.inStock,
          caution: values.caution || undefined,
          applications: values.applications.map((item) => item.value).filter(Boolean),
          specifications: values.specifications
            .filter((item) => item.characteristic || item.specification)
            .map((item, index) => ({
              srNo: index + 1,
              characteristic: item.characteristic || "",
              specification: item.specification || "",
            })),
        },
        slug
      );

      if (imageFile) {
        nextCatalog = await uploadProductImage(nextSlug, imageFile);
      }

      syncCatalogCache(queryClient, nextCatalog);
      toast.success(isEditing ? "Product updated." : "Product created.");
      navigate("/secret/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <CatalogLoadingState label="Loading product editor..." />;
  if (isError) return <CatalogErrorState onRetry={() => refetch()} />;
  if (isEditing && !product) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost">
          <Link to="/secret/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Products
          </Link>
        </Button>
        <CatalogErrorState title="Product not found" message="This product no longer exists in the backend catalog." />
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-3 mb-2">
            <Link to="/secret/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Products
            </Link>
          </Button>
          <h1 className="font-heading text-2xl font-bold">{isEditing ? "Edit Product" : "Create Product"}</h1>
          <p className="text-sm text-muted-foreground">Manage public product details, safety information, and catalog display.</p>
        </div>
        <Button type="submit" disabled={saving || groups.length === 0}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
              <CardDescription>Name, URL slug, group, and short public description.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Product Group</Label>
                <Select value={form.watch("groupSlug")} onValueChange={(value) => form.setValue("groupSlug", value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.slug} value={group.slug}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.groupSlug && <p className="text-xs text-destructive">{form.formState.errors.groupSlug.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Category</Label>
                <Input id="product-category" {...form.register("category")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-name">Name</Label>
                <Input
                  id="product-name"
                  {...form.register("name")}
                  onChange={(event) => {
                    form.setValue("name", event.target.value);
                    if (!isEditing) form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
                  }}
                />
                {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-slug">Slug</Label>
                <Input
                  id="product-slug"
                  {...form.register("slug")}
                  onChange={(event) => form.setValue("slug", slugify(event.target.value), { shouldValidate: true })}
                />
                {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea id="product-description" className="min-h-24" {...form.register("description")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing And Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price</Label>
                <Input id="product-price" placeholder="e.g. 1200" {...form.register("price")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-unit">Unit</Label>
                <Input id="product-unit" placeholder="e.g. kg, litre" {...form.register("unit")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-moq">MOQ</Label>
                <Input id="product-moq" placeholder="e.g. 200L" {...form.register("moq")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-order">Display Order</Label>
                <Input id="product-order" type="number" min="1" {...form.register("order")} />
                {form.formState.errors.order && <p className="text-xs text-destructive">{form.formState.errors.order.message}</p>}
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3 md:col-span-2">
                <div>
                  <Label>Stock Status</Label>
                  <p className="text-xs text-muted-foreground">Controls the public in-stock badge.</p>
                </div>
                <Switch checked={form.watch("inStock")} onCheckedChange={(checked) => form.setValue("inStock", checked)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-purity">Purity</Label>
                <Input id="product-purity" placeholder="e.g. 98%" {...form.register("purity")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-purity-value">Purity Value</Label>
                <Input id="product-purity-value" type="number" min="0" max="100" {...form.register("purityValue")} />
                {form.formState.errors.purityValue && (
                  <p className="text-xs text-destructive">{form.formState.errors.purityValue.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product-caution">Caution / Safety Warning</Label>
                <Textarea id="product-caution" className="min-h-24" {...form.register("caution")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Each row becomes one public specification table row.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => specifications.append({ characteristic: "", specification: "" })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {specifications.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <Input placeholder="Characteristic" {...form.register(`specifications.${index}.characteristic`)} />
                  <Input placeholder="Specification" {...form.register(`specifications.${index}.specification`)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => specifications.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Public list of consuming industries or use cases.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => applications.append({ value: "" })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Application
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {applications.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_auto] gap-2">
                  <Input placeholder="Application" {...form.register(`applications.${index}.value`)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => applications.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>Images are served from backend uploads.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {product?.image ? (
                <img src={product.image} alt={product.name} className="h-56 w-full rounded-md border object-contain" />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
                  <ImagePlus className="mr-2 h-5 w-5" />
                  No image
                </div>
              )}
              <Input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => handleImageChange(event.target.files?.[0] || null)} />
              {imageFile && <p className="text-xs text-muted-foreground">Selected: {imageFile.name}</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 flex justify-end gap-2 border-t border-border bg-background/95 p-4 backdrop-blur">
        <Button asChild type="button" variant="outline">
          <Link to="/secret/products">Cancel</Link>
        </Button>
        <Button type="submit" disabled={saving || groups.length === 0}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
