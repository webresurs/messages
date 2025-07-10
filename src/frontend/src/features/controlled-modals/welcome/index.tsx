import { ControlledModal, useModalStore } from "@/features/providers/modal-store";
import { Button, ModalSize } from "@openfun/cunningham-react";
import { useRouter } from "next/router";

export const MODAL_WELCOME_ID = 'welcome';

export const WelcomeModal = () => {
    const { closeModal } = useModalStore();
    const router = useRouter();

    const handleClick = (href?: string) => {
        closeModal(MODAL_WELCOME_ID);
        if (href) {
            router.push(href);
        }
    }

    return (
        <ControlledModal
            modalId={MODAL_WELCOME_ID}
            size={ModalSize.LARGE}
        >
            <div className="welcome-modal">
                <h1 className="welcome-modal__title">Bienvenue sur Messages !</h1>
                <p className="welcome-modal__description">
                    En tant qu&apos;administrateur de la messagerie Brigny.collectivite.fr,
                    vous devez créer les adresses de messagerie pour tous les membres de la
                    collectivité. Vous pouvez le configurer dès à présent ou ultérieurement.
                </p>

                <div className="welcome-modal__actions">
                    <Button onClick={() => handleClick("/admin")} color="primary" icon={<span className="material-icons">add</span>}>
                        Créer les adresses de messagerie de mes collègues
                    </Button>

                    <Button color="secondary" onClick={() => handleClick()}>
                        Commencer à utiliser mon adresse de messagerie
                    </Button>
                </div>

                <div className="welcome-modal__illustration">
                    <img src="/images/welcome.webp" alt="" />
                </div>
            </div>
        </ControlledModal>
    );
};

export default WelcomeModal;
