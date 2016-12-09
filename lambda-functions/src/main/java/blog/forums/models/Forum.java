package blog.forums.models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIgnore;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.configuration.RequestConfiguration;

@DynamoDBTable(tableName = "REPLACED_BY_API")
public class Forum {

	private String id;
    private String name;
    private RequestConfiguration requestConfiguration;

    @DynamoDBHashKey
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @DynamoDBAttribute
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @DynamoDBIgnore
    @JsonIgnore
    public RequestConfiguration getRequestConfiguration() {
        return requestConfiguration;
    }

    @JsonSetter("config")
    public void setRequestConfiguration(RequestConfiguration requestConfiguration) {
        this.requestConfiguration = requestConfiguration;
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