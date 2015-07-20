package com.mongoconnection;
import com.mongodb.MongoClient;

import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.WriteConcern;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import com.mongodb.ServerAddress;
import java.util.Arrays;

public class Mongoinsert implements mongoconnector{
   public static void main( String args[] ){
      try{   
		 // To connect to mongodb server
         MongoClient mongoClient = new MongoClient(ipaddress,portnum);
         
         //Mongo m=new MongoClient("54.68.193.179",27017);
        /* if(m != null)
        	 System.out.println("Connected succesfullty" + m );
         else{
        	 System.out.println("fail");
         }*/
         System.out.println(mongoClient);
         // Now connect to your databases
         DB db = mongoClient.getDB( "NHDbase" );
		 System.out.println("Connect to database successfully");
		 DBCollection coll = db.getCollection("PROVIDERINFO" );
		 BasicDBObject query = new BasicDBObject();
		 BasicDBObject fields = new BasicDBObject("provnum",true).append("PROVNAME",true).append("_id", false).append("ADDRESS",true).append("CITY", true).append("STATE",true).append("ZIP",true).append("COUNTY_NAME",true).append("overall_rating",true).append("staffing_rating",true).append("survey_rating",true).append("quality_rating",true);
		 //BasicDBObject fields = new BasicDBObject("$add", newBasicDBObjects);//.append("staffing_rating",true).append("survey_rating",true).append("quality_rating",true);
		 DBCursor cursor = coll.find(query,fields);
		 
		 int i=1;
         while (cursor.hasNext()) { 
            System.out.println("Inserted Document: "+i); 
            System.out.println(cursor.next()); 
            i++;
         }
        // boolean auth = db.authenticate(myUserName, myPassword);
		 //System.out.println("Authentication: " + auth);
      }catch(Exception e){
	     System.err.println( e.getClass().getName() + ": " + e.getMessage() );
	  }
   }
}
