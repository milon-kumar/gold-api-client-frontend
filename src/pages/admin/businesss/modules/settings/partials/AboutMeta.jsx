import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

// Icons
import {
  FileText,
  Edit,
  Copy,
  Globe,
  Layout,
  Phone,
  Mail,
  MapPin,
  Shield,
  FileCheck,
  Cookie,
  Headphones,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Eye,
  EyeOff,
  X,
  Plus,
  Trash2,
} from 'lucide-react';

// Custom hooks
import { useApiMutation } from '@/hooks/useAppMutation';
import { useApiQuery } from '@/hooks/useAppQuery';

// Rich Text Editor (you can use any editor you prefer)
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const AboutMeta = () => {
  const [settings, setSettings] = useState({
    about: '',
    phone: '',
    email: '',
    location: '',
    privacy_policy: '',
    terms_conditions: '',
    cookie_policy: '',
    support_email: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editField, setEditField] = useState({
    key: '',
    value: '',
    label: '',
    type: 'text',
  });
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch settings
  const { data: settingsData, isLoading: settingsLoading, refetch } = useApiQuery({
    url: '/admin/settings',
  });

  useEffect(() => {
    if (settingsData?.success && settingsData?.data) {
      setSettings(settingsData.data);
    }
  }, [settingsData]);

  // Update mutation
  const { mutate: updateSettings, isLoading: updateLoading } = useApiMutation({
    url: '/admin/settings',
    method: 'PUT',
  });

  const handleEdit = (key, value, label, type = 'text') => {
    setEditField({ key, value: value || '', label, type });
    setDialogOpen(true);
  };

  const handleSaveField = async () => {
    if (!editField.key) return;

    // Validation
    if (editField.type === 'email' && editField.value && !isValidEmail(editField.value)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (editField.type === 'url' && editField.value && !isValidUrl(editField.value)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...settings,
        [editField.key]: editField.value,
      };

      const response = await updateSettings(payload);
      if (response?.success) {
        setSettings(payload);
        toast.success(`${editField.label} updated successfully`);
        setDialogOpen(false);
        refetch();
      } else {
        toast.error(response?.message || `Failed to update ${editField.label}`);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Error updating setting');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSave = async () => {
    setSaving(true);
    try {
      const response = await updateSettings(settings);
      if (response?.success) {
        toast.success('All settings saved successfully');
        refetch();
      } else {
        toast.error(response?.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getFieldIcon = (key) => {
    const icons = {
      about: <FileText className="h-4 w-4" />,
      phone: <Phone className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      location: <MapPin className="h-4 w-4" />,
      privacy_policy: <Shield className="h-4 w-4" />,
      terms_conditions: <FileCheck className="h-4 w-4" />,
      cookie_policy: <Cookie className="h-4 w-4" />,
      support_email: <Headphones className="h-4 w-4" />,
    };
    return icons[key] || <Settings className="h-4 w-4" />;
  };

  const getFieldColor = (key) => {
    const colors = {
      about: 'purple',
      phone: 'green',
      email: 'blue',
      location: 'red',
      privacy_policy: 'indigo',
      terms_conditions: 'violet',
      cookie_policy: 'pink',
      support_email: 'amber',
    };
    return colors[key] || 'gray';
  };

  const renderFieldValue = (key, value) => {
    if (!value) return <span className="text-muted-foreground">Not set</span>;
    
    if (key === 'privacy_policy' || key === 'terms_conditions' || key === 'cookie_policy') {
      return (
        <div 
          className="prose prose-sm max-w-none line-clamp-2"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }
    
    if (key === 'about') {
      return <p className="text-sm text-muted-foreground line-clamp-2">{value}</p>;
    }
    
    return <p className="text-sm font-medium">{value}</p>;
  };

  const getFieldType = (key) => {
    const types = {
      email: 'email',
      support_email: 'email',
      phone: 'text',
      location: 'text',
      about: 'textarea',
      privacy_policy: 'richtext',
      terms_conditions: 'richtext',
      cookie_policy: 'richtext',
    };
    return types[key] || 'text';
  };

  if (settingsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">About & Meta Settings</h2>
          <p className="text-muted-foreground">
            Manage your company information
          </p>
        </div>
        <Button 
          onClick={handleBulkSave} 
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className={'cursor-pointer'}>General Info</TabsTrigger>
          <TabsTrigger value="legal" className={'cursor-pointer'}>Legal Documents</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* About */}
            <Card className="col-span-2">
              <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-violet-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-purple-600" />
                  About Information
                </CardTitle>
                <CardDescription>Company description and details</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 bg-gray-50 rounded-lg group relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium">About</p>
                      </div>
                      <div className="ml-11">
                        {settings.about ? (
                          <p className="text-sm text-muted-foreground">
                            {settings.about}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No about text set
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit('about', settings.about, 'About', 'textarea')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {[
                  { key: 'phone', label: 'Phone', icon: Phone },
                  { key: 'email', label: 'Email', icon: Mail },
                  { key: 'support_email', label: 'Support Email', icon: Headphones },
                  { key: 'location', label: 'Location', icon: MapPin },
                ].map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 bg-${getFieldColor(field.key)}-100 rounded-full flex-shrink-0`}>
                        <field.icon className={`h-4 w-4 text-${getFieldColor(field.key)}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{field.label}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {settings[field.key] || 'Not set'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(
                        field.key,
                        settings[field.key],
                        field.label,
                        getFieldType(field.key)
                      )}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Legal Documents Tab */}
        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-indigo-600" />
                Legal Documents
              </CardTitle>
              <CardDescription>
                Manage privacy policy, terms & conditions, and cookie policy
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[
                { key: 'privacy_policy', label: 'Privacy Policy', icon: Shield },
                { key: 'terms_conditions', label: 'Terms & Conditions', icon: FileCheck },
                { key: 'cookie_policy', label: 'Cookie Policy', icon: Cookie },
              ].map((field) => (
                <div
                  key={field.key}
                  className="p-4 bg-gray-50 rounded-lg group relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 bg-${getFieldColor(field.key)}-100 rounded-full`}>
                          <field.icon className={`h-4 w-4 text-${getFieldColor(field.key)}-600`} />
                        </div>
                        <p className="text-sm font-medium">{field.label}</p>
                        {settings[field.key] && (
                          <Badge variant="secondary" className="ml-2">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Set
                          </Badge>
                        )}
                      </div>
                      <div className="ml-11">
                        {settings[field.key] ? (
                          <div 
                            className="prose prose-sm max-w-none line-clamp-2 text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: settings[field.key] }}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No {field.label.toLowerCase()} set
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(
                        field.key,
                        settings[field.key],
                        field.label,
                        'richtext'
                      )}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFieldIcon(editField.key)}
              Edit {editField.label}
            </DialogTitle>
            <DialogDescription>
              Update the {editField.label.toLowerCase()} value
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 py-4">
              {editField.type === 'richtext' ? (
                // If using React Quill
                // <ReactQuill
                //   theme="snow"
                //   value={editField.value}
                //   onChange={(value) => setEditField({ ...editField, value })}
                //   className="h-64"
                // />
                // For now, using textarea as fallback
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={editField.value}
                    onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                    placeholder={`Enter ${editField.label.toLowerCase()}`}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports HTML formatting
                  </p>
                </div>
              ) : editField.type === 'textarea' ? (
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={editField.value}
                    onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                    placeholder={`Enter ${editField.label.toLowerCase()}`}
                    className="min-h-[120px]"
                  />
                </div>
              ) : (
                <div>
                  <Label>Value</Label>
                  <Input
                    type={editField.type === 'url' ? 'url' : editField.type === 'email' ? 'email' : 'text'}
                    value={editField.value}
                    onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                    placeholder={`Enter ${editField.label.toLowerCase()}`}
                  />
                  {editField.type === 'url' && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter a valid URL including https://
                    </p>
                  )}
                  {editField.type === 'email' && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter a valid email address
                    </p>
                  )}
                </div>
              )}

              {/* Preview for URL fields */}
              {editField.type === 'url' && editField.value && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Preview: <a href={editField.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {editField.value}
                    </a>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveField} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutMeta;