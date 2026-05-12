import LaporanRiyadhohController from './LaporanRiyadhohController'
import KalamController from './KalamController'
import BannerController from './BannerController'
import Settings from './Settings'

const Controllers = {
    LaporanRiyadhohController: Object.assign(LaporanRiyadhohController, LaporanRiyadhohController),
    KalamController: Object.assign(KalamController, KalamController),
    BannerController: Object.assign(BannerController, BannerController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers