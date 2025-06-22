<template id="carouselTemplate">
    <div :id="'carousel' + name" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button v-for="(item, index) in content" :key="index"
                    :data-bs-target="'#carousel' + name" :data-bs-slide-to="index"
                    :class="{active: index === 0}" :aria-current="index === 0"
                    :aria-label="'Slide ' + (index + 1)"></button>
        </div>
        <div class="carousel-inner">
            <div v-for="(item, index) in content" :key="index"
                 :class="['carousel-item', {active: index === 0}, 'h-100']">
                <div class="block-bg" :style="'background-image: url(\'' + encodeURI(item.image) + '\');'"></div>
                <div class="carousel-caption d-none d-md-block">
                    <h5 v-if="item.title">{{ item.title }}</h5>
                    <p v-if="item.description">{{ item.description }}</p>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button"
                :data-bs-target="'#carousel' + name" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button"
                :data-bs-target="'#carousel' + name" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>

<script>
    app.component('carousel', {
        props: ['name', 'content'],
        template: '#carouselTemplate'});
</script>
