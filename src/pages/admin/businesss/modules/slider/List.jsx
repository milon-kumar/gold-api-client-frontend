import React, { useState } from 'react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Image as ImageIcon,
    Calendar,
    Languages,
    School,
    MoveUp,
    MoveDown,
    Eye,
    Pencil,
    Trash2,
    Filter,
    Grid3x3,
    List,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useNavigate } from 'react-router';
import PageHeader from '@/components/shear/PageHeader';
import { MODULES } from '@/store/default/modules';
import StatusBadge from '@/components/shear/StatusBadge';
import FeaturedBadge from '@/components/shear/FeaturedBadge';
import { useApiMutation } from '@/hooks/useAppMutation';
import DeleteConfirmation from '@/components/shear/DeleteConfirmation';

const SlidersListing = () => {
    const navigate = useNavigate()
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [selectedSchool, setSelectedSchool] = useState('all');

    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [openViewModal, setOpenViewModal] = useState(null)
    const [openDeleteModal, setOpenDeleteModal] = useState(null)
    const [selectedSlider, setSelectedSlider] = useState(null);


    const {
        data: response,
        loading: sliderGetLoading,
        refetch: refetchSlider
    } = useApiQuery({
        url: "/admin/business-module-items",
        params: {
            module_slug: MODULES.SLIDERS
        }
    });

    const sliders = response?.data?.data || [];

    console.log("Sliders - ", sliders)

    const languages = ['all', ...new Set(sliders.map(s => s.lang_slug))];
    const schools = ['all', ...new Set(sliders.map(s => s.school_id))];

    const filteredSliders = sliders.filter(slider => {
        const languageMatch = selectedLanguage === 'all' || slider.lang_slug === selectedLanguage;
        const schoolMatch = selectedSchool === 'all' || slider.school_id === parseInt(selectedSchool);
        return languageMatch && schoolMatch;
    });

    const sortedSliders = [...filteredSliders].sort((a, b) => a.sort_order - b.sort_order);

    const getLanguageName = (code) => {
        const languages = {
            bn: 'বাংলা',
            en: 'English',
            ar: 'العربية',
        };
        return languages[code] || code;
    };

    const onEdit = (slider) => {
        navigate(`/admin/sliders/save/${slider?.id}`)
    }

    const onDelete = (slider) => {
        setSelectedSlider(slider)
        setOpenDeleteModal(true)
    }

    const {
        mutate: sliderDeleteMutation,
        isLoading: sliderDeleteLoading
    } = useApiMutation({
        url: `/admin/module-items/${selectedSlider?.id}`,
        method: 'DELETE'
    })

    const handleDelete = async () => {
        try {
            const response = await sliderDeleteMutation();

            if (response?.success) {
                toast.success(response?.message || "Deleted successfully");

                await refetchSlider()
                setSelectedItem(null);
                setDeleteModal(null);
            }
        } catch (e) {
            console.log("Slider delete error - ", e)
        }
    };

    const GridView = () => (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedSliders.map((slider) => (
                <SliderGridCard key={slider?.id} slider={slider} />
            ))}
        </div>
    );

    const SliderGridCard = ({ slider }) => {
        const meta = JSON.parse(slider?.meta);
        return (
            <Card className="group relative overflow-hidden cursor-pointer rounded-xl border-0 bg-white pt-0 shadow-sm transition-all duration-300">
                <div className="relative overflow-hidden">
                    <img
                        src={slider.image_full_path}
                        alt={slider.title}
                        className="h-56 w-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                    {slider.is_featured == 1 && (
                        <FeaturedBadge />
                    )}

                    <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/90"
                            onClick={() => {
                                setSelectedSlider(slider)
                                setOpenViewModal(true)
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/90"
                            onClick={() => onEdit(slider)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 rounded-full"
                            onClick={() => onDelete(slider)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>

                    </div>

                    <div className="absolute bottom-3 left-3 z-20">
                        <StatusBadge status={slider.status} />
                    </div>
                </div>

                <CardContent>
                    <div>
                        <h3 className="line-clamp-1 text-lg font-bold">
                            {slider.title}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {slider.sub_title}
                        </p>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                        {slider.sub_description}
                    </p>
                </CardContent>

                <CardFooter className="flex gap-5 border-t bg-muted/20 p-4">
                    {
                        meta?.primary_button_title && (
                            <Button
                                className="flex-1"
                                variant="default"
                            >
                                {meta?.primary_button_title || "Read More"}
                            </Button>
                        )
                    }

                    {meta?.secondary_button_title && (
                        <Button
                            className="flex-1"
                            variant="default"
                        >
                            {meta.secondary_button_title}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        )
    }

    const TableView = () => (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40">
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Information</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Buttons</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {sortedSliders.map((slider, index) => (
                        <TableRow
                            key={slider.id}
                            className="group transition-colors hover:bg-muted/30"
                        >
                            <TableCell className="font-semibold">
                                {index + 1}
                            </TableCell>

                            <TableCell>
                                <img
                                    src={slider.image_full_path}
                                    alt={slider.title}
                                    className="h-16 w-24 rounded-lg border object-cover"
                                />
                            </TableCell>

                            <TableCell className="min-w-[280px]">
                                <div className="space-y-1">
                                    <h4 className="font-semibold line-clamp-1">
                                        {slider.title}
                                    </h4>

                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {slider.sub_title}
                                    </p>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {slider.sub_description}
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell>
                                {slider.is_featured ? (
                                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                        ⭐ Featured
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground text-sm">
                                        —
                                    </span>
                                )}
                            </TableCell>

                            <TableCell>
                                <StatusBadge status={slider.status} />
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <Badge variant="outline">
                                        {slider.meta?.primary_button_title ||
                                            "Read More"}
                                    </Badge>

                                    {slider.meta?.secondary_button_title && (
                                        <Badge variant="secondary">
                                            {
                                                slider.meta
                                                    .secondary_button_title
                                            }
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                                {new Date(
                                    slider.created_at
                                ).toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-end gap-2 opacity-40 transition-all group-hover:opacity-100">

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedSlider(slider)
                                            setOpenViewModal(true)
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onEdit(slider)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() =>
                                            onDelete(slider)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
    return (
        <div className="">
            <PageHeader
                title="Website Sliders"
                subtitle={`Manage your website sliders (${sliders.length} items)`}
                primaryAction={{
                    title: "Add Slider",
                    icon: "plus",
                    onClick: () => navigate("/admin/sliders/save")
                }}
            />


            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2">
                    {/* <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-[140px]">
                            <Languages className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((key, value) => (
                                <SelectItem key={key} value={value}>
                                    {value === 'all' ? 'All Languages' : getLanguageName(value)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select> */}
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="h-4 w-4 mr-2" />
                        Grid
                    </Button>
                    <Button
                        variant={viewMode === 'table' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                    >
                        <List className="h-4 w-4 mr-2" />
                        Table
                    </Button>
                </div>
            </div>

            {sortedSliders.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No sliders found</p>
                        <Button variant="link" onClick={() => onEdit?.()} className="mt-2">
                            Create your first slider
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                viewMode === 'grid' ? <GridView /> : <TableView />
            )}

            <Dialog open={openViewModal} onOpenChange={() => setOpenViewModal(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Slider Preview</DialogTitle>
                        <DialogDescription>
                            View slider details and image
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSlider && (
                        <SliderGridCard slider={selectedSlider} />
                    )}
                </DialogContent>
            </Dialog>

            {
                openDeleteModal && (
                    <DeleteConfirmation
                        open={openDeleteModal}
                        onOpenChange={() => {
                            setOpenDeleteModal(null)
                        }}
                        onConfirm={handleDelete}
                        onCancel={() => {
                            setOpenDeleteModal(null)
                            setSelectedSlider(null)
                        }}
                        loading={sliderDeleteLoading}
                    />
                )
            }
        </div>
    );
};

export default SlidersListing;