package blog.configuration;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@DynamoDBTable(tableName = "aws-serverless-config")
public class ApplicationConfiguration {
    
    private String environment;
    private String userDynamoDBTableName;
    private String postDynamoDBTableName;
    private String latestPostDynamoDBTableName;
    private String commentDynamoDBTableName;
    private String forumDynamoDBTableName;
    private String cognitoIdentityPoolId;
    private String cognitoDeveloperId;
    private String encryptionKeyId;

    @DynamoDBHashKey(attributeName = "environment")
    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    @DynamoDBAttribute(attributeName = "user_ddb_table_name")
    public String getUserDynamoDBTableName() {
        return userDynamoDBTableName;
    }

    public void setUserDynamoDBTableName(String userDynamoDBTableName) {
        this.userDynamoDBTableName = userDynamoDBTableName;
    }

    @DynamoDBAttribute(attributeName = "post_ddb_table_name")
    public String getPostDynamoDBTableName() {
        return postDynamoDBTableName;
    }

    public void setPostDynamoDBTableName(String postDynamoDBTableName) {
        this.postDynamoDBTableName = postDynamoDBTableName;
    }
    
    @DynamoDBAttribute(attributeName = "latest_post_ddb_table_name")
    public String getLatestPostDynamoDBTableName() {
		return latestPostDynamoDBTableName;
	}

	public void setLatestPostDynamoDBTableName(String latestPostDynamoDBTableName) {
		this.latestPostDynamoDBTableName = latestPostDynamoDBTableName;
	}

    @DynamoDBAttribute(attributeName = "comment_ddb_table_name")
    public String getCommentDynamoDBTableName() {
        return commentDynamoDBTableName;
    }

    public void setCommentDynamoDBTableName(String commentDynamoDBTableName) {
        this.commentDynamoDBTableName = commentDynamoDBTableName;
    }

    @DynamoDBAttribute(attributeName = "cognito_identity_pool_id")
    public String getCognitoIdentityPoolId() {
        return cognitoIdentityPoolId;
    }

    public void setCognitoIdentityPoolId(String cognitoIdentityPoolId) {
        this.cognitoIdentityPoolId = cognitoIdentityPoolId;
    }

    @DynamoDBAttribute(attributeName = "cognito_developer_id")
    public String getCognitoDeveloperId() {
        return cognitoDeveloperId;
    }

    public void setCognitoDeveloperId(String cognitoDeveloperId) {
        this.cognitoDeveloperId = cognitoDeveloperId;
    }

    @DynamoDBAttribute(attributeName = "encryption_key_id")
    public String getEncryptionKeyId() {
        return encryptionKeyId;
    }

    public void setEncryptionKeyId(String encryptionKeyId) {
        this.encryptionKeyId = encryptionKeyId;
    }
    
    @DynamoDBAttribute(attributeName = "forum_ddb_table_name")
    public String getForumDynamoDBTableName() {
		return forumDynamoDBTableName;
	}

	public void setForumDynamoDBTableName(String forumDynamoDBTableName) {
		this.forumDynamoDBTableName = forumDynamoDBTableName;
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