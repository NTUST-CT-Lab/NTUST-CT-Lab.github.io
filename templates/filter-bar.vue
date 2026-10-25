<template id="filterBarTemplate">
    <div class="d-flex align-items-start gap-2">
        <div ref="list" :class="['filter-bar-list', 'd-flex', 'flex-wrap', 'flex-grow-1', 'row-gap-2', 'column-gap-4', {collapsed: collapsed && multiRow}]"
             :style="collapsed && multiRow ? {maxHeight: firstRowHeight + 'px'} : null">
            <slot></slot>
        </div>
        <button v-show="multiRow" type="button" class="btn btn-outline-secondary flex-shrink-0"
                :aria-expanded="!collapsed" @click="collapsed = !collapsed">
            <i class="material-icons">{{ collapsed ? 'expand_more' : 'expand_less' }}</i>
        </button>
    </div>
</template>

<script>
    app.component('filter-bar', {
        data() {
            return {
                multiRow: false,
                collapsed: false,
                firstRowHeight: 0
            };
        },
        template: '#filterBarTemplate',
        mounted() {
            // filter 的寬度會隨視窗大小、語言切換、選項載入而改變，都要重新判斷是否超過一列
            this._resizeObserver = new ResizeObserver(() => {
                cancelAnimationFrame(this._measureFrame);
                this._measureFrame = requestAnimationFrame(() => this.measure());
            });
            this._resizeObserver.observe(this.$el);
            for (const item of this.$refs.list.children) {
                this._resizeObserver.observe(item);
            }
            this.measure();
        },
        beforeUnmount() {
            this._resizeObserver?.disconnect();
            cancelAnimationFrame(this._measureFrame);
        },
        methods: {
            measure() {
                const list = this.$refs.list;
                const items = [...list.children];
                if (items.length === 0) return;

                // 折疊時只用 max-height 裁切，不影響排版，所以這裡量到的永遠是完整展開時的位置
                const firstTop = items[0].offsetTop;
                let firstRowBottom = 0;
                for (const item of items) {
                    const inFirstRow = item.offsetTop === firstTop;
                    item.toggleAttribute('data-filter-overflow', !inFirstRow);
                    if (inFirstRow) {
                        firstRowBottom = Math.max(firstRowBottom, item.offsetTop + item.offsetHeight);
                    }
                }

                this.multiRow = items.some(item => item.offsetTop !== firstTop);
                this.firstRowHeight = firstRowBottom + parseFloat(getComputedStyle(list).paddingBottom);
            }
        }
    });
</script>
