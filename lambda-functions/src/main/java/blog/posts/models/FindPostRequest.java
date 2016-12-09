package blog.posts.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.configuration.RequestConfiguration;

public class FindPostRequest {

	private String forumId;
    private String id;
    private RequestConfiguration requestConfiguration;
    
    public String getForumId() {
        return forumId;
    }

    public void setForumId(String forumId) {
        this.forumId = forumId;
    }
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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