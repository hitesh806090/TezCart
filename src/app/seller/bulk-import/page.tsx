"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, FileSpreadsheet } from "lucide-react";

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleDownloadTemplate = () => {
    const csvContent = "title,description,price,category,stock\nSample Product,Description here,99.99,Electronics,10";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-import-template.csv";
    a.click();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Bulk Product Import</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Download Template</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download the CSV template to see the required format
            </p>
            <Button onClick={handleDownloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="max-w-xs mx-auto"
              />
              <Button className="mt-4" disabled={!file}>
                <Upload className="mr-2 h-4 w-4" />
                Import Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
