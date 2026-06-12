import LaporanRiyadhohController from './LaporanRiyadhohController'
import KalamController from './KalamController'
import DonasiController from './DonasiController'
import AcaraController from './AcaraController'
import UkhuwahController from './UkhuwahController'
import LingkaranController from './LingkaranController'
import MasjidController from './MasjidController'
import BannerController from './BannerController'
import WebhookController from './WebhookController'
import Settings from './Settings'

const Controllers = {
    LaporanRiyadhohController: Object.assign(LaporanRiyadhohController, LaporanRiyadhohController),
    KalamController: Object.assign(KalamController, KalamController),
    DonasiController: Object.assign(DonasiController, DonasiController),
    AcaraController: Object.assign(AcaraController, AcaraController),
    UkhuwahController: Object.assign(UkhuwahController, UkhuwahController),
    LingkaranController: Object.assign(LingkaranController, LingkaranController),
    MasjidController: Object.assign(MasjidController, MasjidController),
    BannerController: Object.assign(BannerController, BannerController),
    WebhookController: Object.assign(WebhookController, WebhookController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers