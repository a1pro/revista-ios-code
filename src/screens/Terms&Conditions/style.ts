import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor || COLORS.white,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
   web: { flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bckbtn,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40, 
  },


sectionTitle:{
fontSize:18,
marginTop:20,
marginBottom:10
},

listText:{
fontSize:14,
marginBottom:8,
lineHeight:22
},

question:{
marginTop:10,
fontSize:15
},

answer:{
fontSize:14,
marginBottom:10
},

table:{
borderWidth:1,
borderColor:"#ddd",
marginTop:10
},

tableRowHeader:{
flexDirection:"row",
backgroundColor:"#f5f5f5"
},

tableHeader:{
flex:1,
padding:10,
fontWeight:"bold"
},

tableRow:{
flexDirection:"row",
borderTopWidth:1,
borderColor:"#eee"
},

tableCell:{
flex:1,
padding:10
}
});

export default styles;
