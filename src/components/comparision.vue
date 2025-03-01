<v-container class="fill-width">
    <v-row dense class="fill-width">
        <v-col v-for="(num, index) in keys" :key="index" cols="3">
            <v-btn block class="pa-4" color="primary" @click="handleClick(num)">
                {{ num }}
            </v-btn>
        </v-col>
    </v-row>
</v-container>

<v-container>
    <v-row>
      <v-col v-for="(item, index) in buttonLayout" :key="index" cols="4">
        <v-btn @click="handleClick(item)" class="numeric-btn" color="green" large>
          {{ item }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>