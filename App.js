
// imports
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, Image, Animated, Dimensions, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import config from './src/aws-exports'
import { createEntry } from './src/graphql/mutations.js'
Amplify.configure(config)

const { width, height } = Dimensions.get('screen');

// image library, keys correspond to names in dropdownItems
const useableImages = {
  apple : 'https://www.collinsdictionary.com/images/full/apple_158989157.jpg',
  banana: 'https://www.pngkit.com/png/detail/404-4045383_pltano-png-saba-banana.png',
  grape: 'https://www.chefswarehouse.com/assets/images/product/detail/10523420_photo_1.jpg',
  orange: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYsMXYdAv_PyXEIZJ-_zWcwH32eqth4bDzTw&usqp=CAU',
  tomato: 'https://www.thermofisher.com/blog/wp-content/uploads/2014/11/tomato.jpg',
  mango: 'https://plantogram.com/wa-data/public/shop/products/55/06/655/images/1256/1256.750@2x.jpg',
  pear: 'https://images.squarespace-cdn.com/content/v1/588033e8725e25792a4692c1/1586223007579-4BZFZB7LCTR4C3XWLV84/Pear%2C+Bartlett.jpg?format=1000w',
  avocado: 'https://i5.walmartimages.com/asr/447c8d99-28ba-428b-af97-ec514ae263e3_1.0928ed0270b508fa08c84c3d9efe4f8e.jpeg',
  watermelon: 'https://s3.amazonaws.com/finecooking.s3.tauntonclud.com/app/uploads/2017/04/24172315/ING-watermelon.jpg',
  strawberry: 'https://cdn.shopify.com/s/files/1/0164/5605/6886/products/strawberry.jpg?v=1588350357',
  potato: 'https://localyocalfarmtomarket.com/wp-content/uploads/2021/04/ING-russet-potato-main-7.jpg',
  corn: 'https://www.growjoy.com/store/pc/catalog/bodacious_sweet_corn_plant_1834_detail.jpg',
  carrot: 'https://cdn.shopify.com/s/files/1/0570/5324/9692/products/1000-Carrot.png?v=1629374960',
  garlic: 'https://cdn.shopify.com/s/files/1/0360/3578/8938/products/GAR100_photo_1_1024x.jpg?v=1585617351',
  onion: 'https://cdn.shopify.com/s/files/1/0360/3578/8938/products/ONR100_photo_1_1024x.jpg?v=1585616982',
  broccoli: 'https://cdn.shopify.com/s/files/1/0360/3578/8938/products/QG400_photo_1_1024x.jpg?v=1587158537',
  cucumber: 'https://cdn.shopify.com/s/files/1/1537/5553/products/12626_1024x1024.jpg?v=1511276760',
  spinach: 'https://cdn.shopify.com/s/files/1/0275/9229/4470/products/spinach.jpg?v=1592006222',
  lettuce: 'https://img.sunset02.com/sites/default/files/styles/1000x1000/public/image/2015/01/main/lettuce-x.jpg',
  pea: 'https://images.unsplash.com/photo-1587334207407-deb137a955ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlYXxlbnwwfHwwfHw%3D&w=1000&q=80'
}

// available items, label corresponds to keys in image library
const dropdownItems = [
  {label: 'apple', value: '1'},
  {label: 'banana', value: '2'},
  {label: 'grape', value: '3'},
  {label: 'orange', value: '4'},
  {label: 'tomato', value: '5'},
  {label: 'mango', value: '6'},
  {label: 'pear', value: '7'},
  {label: 'avocado', value: '8'},
  {label: 'watermelon', value: '9'},
  {label: 'strawberry', value: '10'},
  {label: 'potato', value: '11'},
  {label: 'corn', value: '12'},
  {label: 'carrot', value: '13'},
  {label: 'garlic', value: '14'},
  {label: 'onion', value: '15'},
  {label: 'broccoli', value: '16'},
  {label: 'cucumber', value: '17'},
  {label: 'spinach', value: '18'},
  {label: 'lettuce', value: '19'},
  {label: 'pea', value: '20'}
]

// width and height of carousel image
const imageW = width;
const imageH = height/2;

// main app
export default function App() {

  // state variables

  // state for the description input box
  const [description, onChangeText] = useState("");
  // state for the dropdown
  const [dropdown, setDropdown] = useState(null);
  // state for the selected drop down value
  const [selected, setSelected] = useState([]);
  // state for the carousel
  const [initialCarousel, changeEl]  = useState([]);
  // state for the carousel
  const [exampleState, setExampleState] = useState(initialCarousel);
  // state for the id of the items added to the carousel
  const [idx, incr] = useState(2);

  // function to add an item to the carousel array, updates the state 
  const addElement = async (dict) => {
    var newArray = [...initialCarousel , {label: dict['label'], description: dict['desc'], imageURL: dict['url']}];

    // entry to add to the database
    const entry = {
      name: dict['label'],
      description: dict['desc'],
    }

    // create Entry in the database
    await API.graphql(graphqlOperation(createEntry, { input: entry }))
    incr(idx + 1);

    // change carousel array
    setExampleState(newArray);
    changeEl(newArray);
  }

  // function to render the items in the carousel array
  const _renderItem = item => {
      return (
      <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
      </View>
      );
  };

  // return carousel
  
  return (
    <View style= {{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar hidden/>


      
      <FlatList 
        data = {exampleState}
        keyExtractor = {(_, index) => index.toString()}
        horizontal
        pagingEnabled

        renderItem = {({item}) => {
          return <View style = {{ width }}>
            <Image source = {{uri: item['imageURL']}} style = {{
              width: imageW,
              height: imageH,
              resizeMode: 'cover',
              borderRadius: 16
            }}/>

            <Text style = {{ alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', fontSize: 20 }}>
              {item["label"]}
            </Text>
            <Text style = {{ alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}>
              {item['description']}
            </Text>

            
          </View>
        }}
      />
      

      <View style={styles.container}>
        <Dropdown
            style={styles.dropdown}
            containerStyle={styles.shadow}
            data={dropdownItems}
            search
            searchPlaceholder="Search"
            labelField="label"
            valueField="value"
            label="Dropdown"
            placeholder="Select item"
            value={dropdown}
            onChange={item => {
            setDropdown(item.value);
                console.log('selected', item);
            }}
            renderItem={item => _renderItem(item)}
            textError="Error"
            maxHeight= {150}
        />

        <TextInput
          multiline
          style={styles.input}
          onChangeText={onChangeText}
          value={description}
          placeholder="Description"
          numberOfLines={3}
          style={{padding: 10}}
        />


        <Button
          onPress={() => {
            var carouselLabel = dropdownItems[dropdown - 1].label
            addElement({label: carouselLabel, desc: description, url: useableImages[carouselLabel]})
          }}

          title="Add Item"
          color="#841584"
          accessibilityLabel="Add Itema"
        />


      </View>
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 40,
  },
  dropdown: {
    paddingLeft: 10,
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 5,
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

