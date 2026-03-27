import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Typography } from "@mui/material";
import { Document, Page, PDFDownloadLink } from "@react-pdf/renderer";
import { RowStack } from "../RowStack";
import { pxToRem } from "../../../../common";

type ImageAttachmentProps = {
  text: string;
  imageUrl?: string;
};

const isPdf = (url?: string) => typeof url === "string" && url.toLowerCase().endsWith(".pdf");

export function ImageAttachment({ text, imageUrl }: ImageAttachmentProps) {
  const handleImageDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = imageUrl.split("/").pop() ?? "attachment";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  if (isPdf(imageUrl)) {
    return (
      <PDFDownloadLink
        document={
          <Document>
            <Page size="A4" />
          </Document>
        }
        fileName={imageUrl?.split("/").pop() ?? "document.pdf"}
        style={{ textDecoration: "none" }}
      >
        {({ loading }) => (
          <RowStack spacing={1} sx={{ cursor: "pointer", alignItems: "center" }}>
            <AttachFileIcon sx={{ color: "text.primary" }} />

            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 500,
                fontSize: pxToRem(16),
                lineHeight: "24px",
                fontFamily: (theme) => theme.typography.fontFamily,
                textDecoration: "underline",
              }}
            >
              {loading ? "Preparing PDF..." : text}
            </Typography>
          </RowStack>
        )}
      </PDFDownloadLink>
    );
  }

  return (
    <RowStack
      spacing={1}
      sx={{
        cursor: imageUrl ? "pointer" : "default",
        alignItems: "center",
      }}
      onClick={handleImageDownload}
    >
      <AttachFileIcon sx={{ color: "text.primary" }} />
      <Typography
        sx={{
          color: "primary.main",
          fontWeight: 500,
          fontSize: pxToRem(16),
          lineHeight: "24px",
          fontFamily: (theme) => theme.typography.fontFamily,
          textDecoration: imageUrl ? "underline" : "none",
        }}
      >
        {text}
      </Typography>
    </RowStack>
  );
}
