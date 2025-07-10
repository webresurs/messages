import { logout } from "@/features/auth";
import { DropdownMenu } from "@gouvfr-lasuite/ui-kit";
import { Button } from "@openfun/cunningham-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <DropdownMenu
          options={[
            {
              label: t("user_menu.admin"),
              icon: <span className="material-icons">admin_panel_settings</span>,
              callback: () => router.push("/admin"),
            },
            {
              label: t("user_menu.logout"),
              icon: <span className="material-icons">logout</span>,
              callback: logout,
            },
          ]}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Button
            color="primary-text"
            onClick={() => setIsOpen(!isOpen)}
            icon={
              <span className="material-icons">
                {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            }
            iconPosition="right"
          >
            <span className="text-nowrap">{t("my_account")}</span>
          </Button>
        </DropdownMenu>
    )
}

export default UserMenu;
