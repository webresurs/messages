import { AdminLayout } from "@/features/layouts/components/admin/admin-layout";
import { useState } from "react";
import { Button } from "@openfun/cunningham-react";
import { useRouter } from "next/router";
import { useMaildomainsMailboxesList } from "@/features/api/gen/maildomains/maildomains";

const templateFields = [
  { field: "[firstname]", description: "Prénom" },
  { field: "[lastname]", description: "Nom de famille" },
  { field: "[jobtitle]", description: "Fonction" },
  { field: "[department]", description: "Service" },
  { field: "[phone]", description: "Téléphone" },
  { field: "[mobile]", description: "Mobile" },
  { field: "[email]", description: "Adresse email" },
  { field: "[website]", description: "Site web" },
];

export default function AdminSignaturesDomainPage() {
  const router = useRouter();
  const domainId = router.query.maildomainId as string;
  
  const { data: mailboxesData, isLoading } = useMaildomainsMailboxesList(domainId);
  
  // Get domain name from the first mailbox, or use a fallback
  const domainName = mailboxesData?.data.results?.[0]?.domain_name || domainId;
  
  const [signatureText, setSignatureText] = useState(`Cordialement,

[firstname] [lastname]
[jobtitle]

Téléphone : [phone]
Email : [email]
Site web : https://www.${domainName}

---
Cet email et toutes les pièces jointes sont confidentiels et destinés exclusivement à la personne ou à l&rsquo;entité à laquelle ils sont adressés.`);

  const insertTemplateField = (field: string) => {
    const textarea = document.getElementById("signature-textarea") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = signatureText;
      const newText = text.substring(0, start) + field + text.substring(end);
      setSignatureText(newText);
      
      // Restore cursor position after the inserted field
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + field.length, start + field.length);
      }, 0);
    }
  };

  const handleSave = () => {
    // TODO: Save signature via API
    console.log("Saving signature:", signatureText);
  };

  if (!domainId) {
    return (
      <AdminLayout>
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--c--theme--colors--danger-600)" }}>
          Domaine non trouvé
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      domainId={domainId}
      domainName={domainName}
      currentTab="signatures"
      showNewButton={false}
    >
      <div className="admin-page__section">
        <h2>Signature email par défaut</h2>
        <p style={{ color: "var(--c--theme--colors--greyscale-600)", marginBottom: "1.5rem" }}>
          Définissez la signature qui sera automatiquement ajoutée aux emails envoyés depuis les adresses de ce domaine. 
          Utilisez les champs de modèle ci-dessous pour personnaliser automatiquement la signature selon l&rsquo;utilisateur.
        </p>
      </div>

      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Chargement des informations du domaine...
        </div>
      ) : (
        <div className="admin-signatures">
          <div className="admin-signatures__editor">
            <div className="admin-signatures__template-fields">
              <h3>Champs de modèle disponibles</h3>
              <div className="admin-signatures__fields-grid">
                {templateFields.map((template) => (
                  <button
                    key={template.field}
                    type="button"
                    className="admin-signatures__field-button"
                    onClick={() => insertTemplateField(template.field)}
                    title={`Insérer ${template.description}`}
                  >
                    <code>{template.field}</code>
                    <span>{template.description}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="admin-signatures__textarea-container">
              <label htmlFor="signature-textarea" className="admin-signatures__label">
                Signature email
              </label>
              <textarea
                id="signature-textarea"
                className="admin-signatures__textarea"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                rows={15}
                placeholder="Saisissez votre signature email..."
              />
            </div>
          </div>

          <div className="admin-signatures__preview">
            <h3>Aperçu</h3>
            <div className="admin-signatures__preview-content">
              <div style={{ 
                border: "1px solid var(--c--theme--colors--greyscale-300)",
                borderRadius: "4px",
                padding: "1rem",
                backgroundColor: "var(--c--theme--colors--greyscale-50)",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap"
              }}>
                {signatureText
                  .replace(/\[firstname\]/g, "Jean-Philippe")
                  .replace(/\[lastname\]/g, "Dupont")
                  .replace(/\[jobtitle\]/g, "Directeur")
                  .replace(/\[department\]/g, "Direction générale")
                  .replace(/\[phone\]/g, "01 23 45 67 89")
                  .replace(/\[mobile\]/g, "06 12 34 56 78")
                  .replace(/\[email\]/g, `jean-philippe.dupont@${domainName}`)
                  .replace(/\[website\]/g, `https://www.${domainName}`)
                }
              </div>
            </div>
          </div>

          <div className="admin-signatures__actions">
            <Button color="primary" onClick={handleSave}>
              Enregistrer la signature
            </Button>
            <Button color="secondary" onClick={() => setSignatureText("")}>
              Effacer
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 