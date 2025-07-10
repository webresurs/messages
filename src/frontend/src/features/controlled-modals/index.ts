import { ModalMessageImporter, MODAL_MESSAGE_IMPORTER_ID } from "@/features/controlled-modals/message-importer";
import { registerModal } from "../providers/modal-store";
import WelcomeModal, { MODAL_WELCOME_ID } from "./welcome";

// Imperatively register all controlled modals
registerModal(MODAL_MESSAGE_IMPORTER_ID, ModalMessageImporter);
registerModal(MODAL_WELCOME_ID, WelcomeModal);
