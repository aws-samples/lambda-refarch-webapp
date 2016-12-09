package blog.posts.models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@DynamoDBTable(tableName="REPLACED_BY_API")
public class LatestPostByForum {

	    private String forumId;
	    private long createdAt;
	    private String id;
	    private String title;

	    public LatestPostByForum(){
	    }
	    
	    public LatestPostByForum(Post post){
	    	this.createdAt = post.getCreatedAt();
	        this.forumId = post.getForumId();
	        this.id = post.getId();
	        this.title = post.getTitle();
	    }
	    
	    @DynamoDBHashKey
	    public String getForumId() 
	    { 
	    	return forumId; 
	    }
	    public void setForumId(String forumId) 
	    { 
	    	this.forumId = forumId; 
	    } 

	    @DynamoDBRangeKey(attributeName = "created_at")
	    public long getCreatedAt() 
	    { 
	    	return createdAt; 
	    }
	    
	    public void setCreatedAt(long createdAt) 
	    { 
	    	this.createdAt = createdAt; 
	    } 
	    
	    @DynamoDBAttribute
	    public String getId() {
	        return id;
	    }

	    public void setId(String id) {
	        this.id = id;
	    }
	    
	    @DynamoDBAttribute
	    public String getTitle() {
	        return title;
	    }

	    public void setTitle(String title) {
	        this.title = title;
	    }
	    
	    @Override
	    public String toString() {
	        ObjectMapper mapper = new ObjectMapper();
	        try {
	            return mapper.writeValueAsString(this);
	        } catch (JsonProcessingException e) {
	            return "error";
	        }
	    }
 
}
