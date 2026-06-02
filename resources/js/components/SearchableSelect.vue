<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, null],
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    required: true
  },
  valueKey: {
    type: String,
    default: "id"
  },
  labelKey: {
    type: String,
    default: "name"
  },
  labelFormatter: {
    type: Function as () => ((item: any) => string),
    default: null
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue"]);

const wrapper = ref<HTMLElement | null>(null);
const open = ref(false);
const search = ref("");

// ===============================
// NORMALIZED VALUE
// ===============================
const selectedValues = computed<any[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }
  return props.modelValue !== null ? [props.modelValue] : [];
});

const selectedItems = computed(() =>
  props.items.filter(i => 
    // Kita ubah kedua sisi menjadi String agar "1" cocok dengan 1
    selectedValues.value.some(val => String(val) === String(i[props.valueKey]))
  )
);

// ===============================
// PLACEHOLDER
// ===============================
const placeholder = computed(() => {
  if (props.multiple) {
    return `Pilih ${props.label.toLowerCase()}...`;
  }

  return selectedItems.value[0]
    ? getItemLabel(selectedItems.value[0])
    : `Cari ${props.label.toLowerCase()}...`;
});

// ===============================
// FILTER
// ===============================
const filteredItems = computed(() =>
  props.items.filter(i =>
    getItemLabel(i)
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
);

// ===============================
// SELECT ITEM
// ===============================
function selectItem(item: any) {
  const value = item[props.valueKey];

  if (props.multiple) {
    const next = [...selectedValues.value];
    if (!next.includes(value)) next.push(value);
    emit("update:modelValue", next);
    search.value = "";
    open.value = true;
  } else {
    emit("update:modelValue", value);
    search.value = getItemLabel(item);
    open.value = false;
  }
}

// ===============================
// REMOVE (MULTIPLE)
// ===============================
function removeItem(value: any) {
  const next = selectedValues.value.filter(v => v !== value);
  emit("update:modelValue", next);
}

// ===============================
// CLEAR (SINGLE)
// ===============================
function clearSingle() {
  emit("update:modelValue", '');  // kirim '' bukan null
  search.value = "";
  open.value = true;
}

// ===============================
// SYNC SEARCH (SINGLE)
// ===============================
watch(
  () => props.modelValue,
  () => {
    if (!props.multiple) {
      search.value = selectedItems.value[0]
        ? getItemLabel(selectedItems.value[0])
        : "";
    }
  },
  { immediate: true }
);

// ===============================
// CLICK OUTSIDE
// ===============================
function onClickOutside(e: MouseEvent) {
  if (!wrapper.value) return;
  if (!wrapper.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

// ===============================
//  FORMATER
// ===============================
function getItemLabel(item: any): string {
  if (props.labelFormatter) {
    return props.labelFormatter(item);
  }
  return String(item[props.labelKey] ?? "");
}
</script>

<template>
  <div class="relative" ref="wrapper">

    <div
      v-if="multiple && selectedItems.length"
      class="flex flex-wrap gap-1 mb-2"
    >
      <span
        v-for="item in selectedItems"
        :key="item[valueKey]"
        class="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 px-2 py-1 rounded text-sm flex items-center gap-1 transition-colors"
      >
        {{ getItemLabel(item) }}
        <button
          @click.prevent="removeItem(item[valueKey])"
          class="text-stone-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-400 focus:outline-none"
        >
          ✕
        </button>
      </span>
    </div>

    <div class="relative">
      <input
        type="text"
        v-model="search"
        :placeholder="placeholder"
        @focus="open = true"
        class="w-full border px-3 py-2 pr-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-stone-950 border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600"
      />

      <button
        v-if="!multiple && modelValue !== null && modelValue !== ''"
        @click.prevent="clearSingle"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 focus:outline-none transition-colors"
      >
        ✕
      </button>
    </div>

    <div
      v-if="open"
      class="absolute z-[60] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 w-full mt-1 max-h-48 overflow-auto rounded-md shadow-lg transition-colors"
    >
      <div
        v-for="item in filteredItems"
        :key="item[valueKey]"
        @click="selectItem(item)"
        class="px-3 py-2 cursor-pointer text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
      >
        {{ getItemLabel(item) }}
      </div>

      <div
        v-if="filteredItems.length === 0"
        class="text-sm p-3 text-stone-500 dark:text-stone-400 text-center"
      >
        Tidak ada hasil
      </div>
    </div>

  </div>
</template>