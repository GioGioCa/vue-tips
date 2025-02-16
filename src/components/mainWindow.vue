//@ts-ignore
<template>
    <main>
        <div class="container">
            <div class="app">
                <div class="header">
                    <h1>Tip Calculator</h1>
                    <button id="reset">Reset</button>
                </div>
                <div class="tip-amount">
                    <input type="number" id="tipInput" placeholder="Enter tip" v-model="tipInput"/>
                    <span class="edit-icon">✎</span>
                </div>
                <div class="split-section">
                    <label for="splitInput">Split: </label>
                    <input type="number" id="splitInput" value="1" v-model="splitInput"/>
                </div>
                <div class="total" id="totalAmount">Total: $0.00</div>

            </div>
        </div>

    </main>
</template>

<script>
export default {
    setup () {

        return {}
    }
}
</script>

<style lang="scss" scoped>

</style>