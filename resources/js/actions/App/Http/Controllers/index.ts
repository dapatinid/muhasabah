import LaporanRiyadhohController from './LaporanRiyadhohController'
import KalamController from './KalamController'
import DonasiController from './DonasiController'
import AcaraController from './AcaraController'
import BannerController from './BannerController'
import Settings from './Settings'

const Controllers = {
    LaporanRiyadhohController: Object.assign(LaporanRiyadhohController, LaporanRiyadhohController),
    KalamController: Object.assign(KalamController, KalamController),
    DonasiController: Object.assign(DonasiController, DonasiController),
    AcaraController: Object.assign(AcaraController, AcaraController),
    BannerController: Object.assign(BannerController, BannerController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers