import { DeLabAddress, DeLabConnect } from '@delab-team/connect'
import { Settings } from 'react-slick'

export interface PageProps {
    id: string,
    setActiveModal: Function,
    consoleLog: Function,
    isDesktop: boolean,
    installScripts: Function,
    openModalData: Function,
    address: DeLabAddress,
    DeLabConnector: DeLabConnect,
    settings: Settings
}
