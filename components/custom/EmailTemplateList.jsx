"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useConvex } from "convex/react";
import { useUserDetail, useEmailTemplate } from "@/app/provider";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "./ConfirmationDialog";
import { Star } from "lucide-react";

function EmailTemplateList() {
  const convex = useConvex();
  const { userDetail } = useUserDetail();
  const { setEmailTemplate } = useEmailTemplate();
  const [templates, setTemplates] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    userDetail && GetTemplateList();
  }, [userDetail]);

  const GetTemplateList = async () => {
    const result = await convex.query(api.emailTemplate.GetAllUserTemplate, {
      email: userDetail?.email,
    });
    setTemplates(result || []);
  };

  const handleDeleteTemplate = async (tid) => {
    try {
      await convex.mutation(api.emailTemplate.DeleteTemplate, { tid });
      toast.success("Template deleted successfully");
      GetTemplateList();
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const handleDeleteAllTemplates = async () => {
    try {
      await convex.mutation(api.emailTemplate.DeleteAllUserTemplates, {
        email: userDetail?.email,
      });
      toast.success("All templates deleted successfully");
      setTemplates([]);
    } catch (error) {
      toast.error("Failed to delete templates");
    }
  };

  const handleToggleFavorite = async (tid) => {
    try {
      await convex.mutation(api.emailTemplate.ToggleFavorite, { tid });
      // Update the UI immediately for a smoother experience
      setTemplates(templates.map(template =>
        template.tid === tid
          ? { ...template, isFavorite: !template.isFavorite }
          : template
      ));
      toast.success("Favorite status updated");
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  // Sort templates to show favorites first
  const sortedTemplates = [...templates].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl text-primary mt-6">Workspace</h2>
        {templates.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setDeleteAllDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All
          </Button>
        )}
      </div>

      {/* Delete All Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        onConfirm={handleDeleteAllTemplates}
        title="Delete all templates"
        description={`Are you sure you want to delete all ${templates.length} templates? This action cannot be undone.`}
      />

      {/* Single Template Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
        title="Delete template"
        description="Are you sure you want to delete this template? This action cannot be undone."
      />

      {!templates || templates.length === 0 ? (
        <div className="flex justify-center mt-7 flex-col items-center">
          <Image src={"/email.png"} alt="email" height={250} width={250} />
          <Link href={"/dashboard/create"}>
            <Button className="mt-7">+ Create New</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {sortedTemplates.map((item, index) => (
            <div key={index} className="relative p-5 rounded-lg shadow-md border hover:shadow-lg transition-shadow bg-black/10 dark:bg-white/5 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3"
                onClick={() => handleToggleFavorite(item.tid)}
              >
                {item.isFavorite ?
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> :
                  <Star className="h-5 w-5" />
                }
              </Button>
              <Image
                src={"/emailbox.png"}
                alt="email"
                width={200}
                height={200}
                className="w-full"
              />
              <h2 className="mt-3 font-medium line-clamp-2 mb-10 text-muted-foreground">{item?.description || ""}</h2>
              <div className="grid grid-cols-3 w-full gap-2 absolute bottom-3">
                <Link href={"/editor/" + item.tid} className="col-span-2">
                  <Button
                    className="w-full bg-black dark:bg-white"
                    onClick={() => {
                      setEmailTemplate({
                        design: item.design || [],
                        description: item.description || "",
                        tid: item.tid
                      });
                    }}
                  >
                    View/Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="icon"
                  className="col-span-1"
                  onClick={() => {
                    setTemplateToDelete(item.tid);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmailTemplateList;