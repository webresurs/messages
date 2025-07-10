import { AdminLayout } from "@/features/layouts/components/admin/admin-layout";
import { DataGrid } from "@openfun/cunningham-react";
import { useRouter } from "next/router";
import { useMaildomainsMailboxesList } from "@/features/api/gen/maildomains/maildomains";

function AdminDnsDataGrid({ domainName }: { domainName: string }) {
  const mockDnsRecords = [
    { 
      id: "1", 
      type: "MX", 
      name: "@", 
      value: `10 mail.${domainName}.`,
      status: "Configuré",
      description: "Serveur de messagerie principal"
    },
    { 
      id: "2", 
      type: "TXT", 
      name: "@", 
      value: `v=spf1 include:_spf.${domainName} ~all`,
      status: "Configuré",
      description: "Enregistrement SPF pour l'authentification"
    },
    { 
      id: "3", 
      type: "TXT", 
      name: "_dmarc", 
      value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domainName}`,
      status: "Non configuré",
      description: "Politique DMARC pour la sécurité email"
    },
    { 
      id: "4", 
      type: "CNAME", 
      name: "mail", 
      value: `mail.${domainName}.`,
      status: "Configuré",
      description: "Alias pour le serveur de messagerie"
    },
    { 
      id: "5", 
      type: "TXT", 
      name: "default._domainkey", 
      value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...",
      status: "Non configuré",
      description: "Clé DKIM pour la signature des emails"
    },
  ];

  const columns = [
    {
      id: "type",
      headerName: "Type",
      renderCell: ({ row }: { row: any }) => (
        <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
          {row.type}
        </span>
      ),
    },
    {
      id: "name", 
      headerName: "Nom",
      renderCell: ({ row }: { row: any }) => (
        <span style={{ fontFamily: "monospace" }}>
          {row.name}
        </span>
      ),
    },
    {
      id: "value",
      headerName: "Valeur", 
      renderCell: ({ row }: { row: any }) => (
        <span style={{ 
          fontFamily: "monospace", 
          fontSize: "0.85em",
          wordBreak: "break-all"
        }}>
          {row.value.length > 50 ? `${row.value.substring(0, 50)}...` : row.value}
        </span>
      ),
    },
    {
      id: "status",
      headerName: "Statut", 
      renderCell: ({ row }: { row: any }) => (
        <span style={{ 
          color: row.status === "Configuré" ? "var(--c--theme--colors--success-600)" : "var(--c--theme--colors--warning-600)" 
        }}>
          {row.status}
        </span>
      ),
    },
    {
      id: "description",
      headerName: "Description", 
      renderCell: ({ row }: { row: any }) => (
        <span style={{ fontSize: "0.9em", color: "var(--c--theme--colors--greyscale-600)" }}>
          {row.description}
        </span>
      ),
    },
  ];

  return (
    <div className="admin-data-grid">
      <DataGrid
        columns={columns}
        rows={mockDnsRecords}
      />
    </div>
  );
}

export default function AdminDnsDomainPage() {
  const router = useRouter();
  const domainId = router.query.maildomainId as string;
  
  const { data: mailboxesData, isLoading } = useMaildomainsMailboxesList(domainId);
  
  // Get domain name from the first mailbox, or use a fallback
  const domainName = mailboxesData?.data.results?.[0]?.domain_name || domainId;

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
      currentTab="dns"
      showNewButton={false}
    >
      <div className="admin-page__section">
        <h2>Enregistrements DNS requis</h2>
        <p style={{ color: "var(--c--theme--colors--greyscale-600)", marginBottom: "1rem" }}>
          Configurez ces enregistrements DNS chez votre registraire de domaine pour que la messagerie fonctionne correctement.
        </p>
      </div>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Chargement des informations du domaine...
        </div>
      ) : (
        <AdminDnsDataGrid domainName={domainName} />
      )}
    </AdminLayout>
  );
} 