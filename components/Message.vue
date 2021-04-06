<template>
    <div :class="'msg ' + ((selected)?'msg-selected':'')">
        <div :class="'msg-block ' + ((client)?'msg-client':'')" @dblclick="$emit('select')">
            <div class="msg-header">
                <!-- header -->
                <a :href="'/social_network/users/' + id_user">
                    <b-img v-bind="{ blank: true, width: 30, height: 30 }" rounded="circle" blank-color="#777" alt="Circle image"></b-img>
                    <span>{{f}} {{i}}</span>
                </a>
            </div>
            <div class="msg-body">
                <!-- body -->
                <p>{{body}}</p>
            </div>
            <div class="msg-footer d-block">
                <!-- footer -->
                <span>{{dt}}</span>
            </div>
        </div>
    </div>
</template>

<style>
    .msg{
        width: 100%;
        padding: 0.5rem;
        overflow: hidden;
    }
    .msg-client{
        float: right;
        background-color: #e2e3e5 !important;
    }
    .msg-selected{
        background-color: #eee !important;
    }
    .msg-block{
        max-width: 46%;
        margin: 0 2%;
        width: max-content;
        border: 1px solid #dee2e6 !important;
        background-color: #fefefe ;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
    }
    .msg-header{
        margin-bottom: 0.5rem;
    }
    .msg-header > a{
        text-decoration: none;
    }
    .msg-footer{
        margin-top: 0.5rem;
        color: #6c757d !important;
        font-size: 80%;
        font-weight: 400;
        overflow: hidden;
    }
    .msg-footer > span {
        float: right;
    }
</style>

<script>
/**
 * Компанент сообщения чата
 */
export default {
    props: {
        avatarSrc: String,
        f: String, i: String, o: String,
        body: String, dt: String, id_user: Number,
        client: Boolean,
        selected: Boolean
    }
}
</script>