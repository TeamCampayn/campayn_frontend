
import { Package, MapPin, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ShippingDetailsProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ShippingDetails = ({ data, updateData, onNext, onPrev }: ShippingDetailsProps) => {
  return (
    <Card className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
      <CardContent className="p-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product & Shipping Details</h2>
            <p className="text-gray-600">Tell us about your product for creators</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <Label className="text-lg font-semibold text-gray-900">Shipping Required</Label>
                <p className="text-sm text-gray-600">Do you need to ship products to creators?</p>
              </div>
            </div>
            <Switch
              checked={data.shippingRequired || false}
              onCheckedChange={(checked) => updateData({ shippingRequired: checked })}
            />
          </div>

          {data.shippingRequired && (
            <div className="space-y-6 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Product Name</Label>
                  <Input
                    value={data.productName || ''}
                    onChange={(e) => updateData({ productName: e.target.value })}
                    placeholder="Enter product name"
                    className="rounded-xl border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Product Link</Label>
                  <Input
                    value={data.productLink || ''}
                    onChange={(e) => updateData({ productLink: e.target.value })}
                    placeholder="https://..."
                    className="rounded-xl border-gray-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Retail Value (₹)</Label>
                  <Input
                    type="number"
                    value={data.retailValue || ''}
                    onChange={(e) => updateData({ retailValue: Number(e.target.value) })}
                    placeholder="0"
                    className="rounded-xl border-gray-300"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Product Category</Label>
                  <Input
                    value={data.productCategory || ''}
                    onChange={(e) => updateData({ productCategory: e.target.value })}
                    placeholder="e.g., Fashion, Beauty, Tech"
                    className="rounded-xl border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-900 font-semibold mb-2">
                  📦 Shipping Information
                </p>
                <p className="text-amber-800">
                  We'll coordinate with creators for product delivery. Standard shipping takes 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={onPrev}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold transition-all duration-200"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Continue →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
