import LaporanRiyadhohController from './LaporanRiyadhohController'
import KalamController from './KalamController'
import Settings from './Settings'

const Controllers = {
    LaporanRiyadhohController: Object.assign(LaporanRiyadhohController, LaporanRiyadhohController),
    KalamController: Object.assign(KalamController, KalamController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers